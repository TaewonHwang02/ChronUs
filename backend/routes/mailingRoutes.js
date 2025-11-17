import express from "express";
import nodemailer from "nodemailer";
import schedule from "node-schedule";
import Meeting from "../models/meetingSchema.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("USER:", process.env.USER);
console.log("APP_PASSWORD:", process.env.APP_PASSWORD ? "Loaded" : "Missing");

const router = express.Router();

// Manual email sending route
router.post("/send", async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    await sendEmail({ to, subject, text, html });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Manual email error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Load HTML email template
const loadMailTemplate = () => {
  const templatePath = path.join(__dirname, "mailFormat.html");
  return fs.readFileSync(templatePath, "utf-8");
};

// Generate HTML table rows for time slots
const generateTimeSlotRows = (aggregatedSlots) => {
  if (aggregatedSlots.length === 0) {
    return `<tr><td colspan="4">No time slots available.</td></tr>`;
  }

  return aggregatedSlots
    .map(
      (slot) => `
    <tr>
      <td>${slot.date}</td>
      <td>${slot.minTime}</td>
      <td>${slot.maxTime}</td>
      <td>${slot.participants.join(", ")}</td>
    </tr>`
    )
    .join("");
};

// Nodemailer email sender
const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Chronus" <${process.env.USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error.message);
  }
};

// Aggregate participant time slots and find the ones with the maximum participants
const aggregateAndPrioritizeTimeSlots = (participants) => {
  const timeSlotMap = new Map();

  participants.forEach((participant) => {
    (participant.times || []).forEach((timeSlot) => {
      const slotKey = `${timeSlot.date}-${timeSlot.minTime}-${timeSlot.maxTime}`;
      if (!timeSlotMap.has(slotKey)) {
        timeSlotMap.set(slotKey, {
          date: timeSlot.date,
          minTime: timeSlot.minTime,
          maxTime: timeSlot.maxTime,
          participants: [],
        });
      }
      timeSlotMap.get(slotKey).participants.push(participant.name);
    });
  });

  const aggregatedSlots = Array.from(timeSlotMap.values());
  const maxParticipants = Math.max(
    ...aggregatedSlots.map((slot) => slot.participants.length)
  );

  return aggregatedSlots.filter(
    (slot) => slot.participants.length === maxParticipants
  );
};

// Scheduled email sender
const checkAndSendEmails = async () => {
  try {
    const nowUtc = new Date();
    const meetings = await Meeting.find({
      emailOption: true,
      email: { $exists: true, $ne: "" },
      deadline: { $lte: nowUtc },
    });

    for (const meeting of meetings) {
      if (!meeting.email) {
        console.warn(`No email provided for meeting ID: ${meeting._id}`);
        continue;
      }

      const maxAggregatedSlots = aggregateAndPrioritizeTimeSlots(
        meeting.participants || []
      );
      const tableRows = generateTimeSlotRows(maxAggregatedSlots);

      const template = loadMailTemplate();
      const emailHtml = template
        .replace("{{meetingName}}", meeting.meetingName)
        .replace("{{timeSlots}}", tableRows)
        .replace("{{year}}", new Date().getFullYear());

      await sendEmail({
        to: meeting.email,
        subject: `Reminder: ${meeting.meetingName}`,
        html: emailHtml,
      });

      meeting.emailOption = false; // mark as sent
      await meeting.save();

      console.log(`Email sent for meeting ID: ${meeting._id}`);
    }
  } catch (error) {
    console.error("Error checking and sending emails:", error.message);
  }
};

// Scheduler: runs every minute
schedule.scheduleJob("*/1 * * * *", () => {
  console.log("Scheduler:", new Date().toLocaleString());
  checkAndSendEmails();
});

export default router;
