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

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
} else {
  dotenv.config();
}

console.log("USER:", process.env.USER);
console.log("APP_PASSWORD:", process.env.APP_PASSWORD ? "Loaded" : "Missing");

const router = express.Router();

const loadMailTemplate = () => {
  try {
    const templatePath = path.join(
      process.cwd(),
      "templates",
      "mailFormat.html"
    );
    console.log("Loading template from:", templatePath);

    return fs.readFileSync(templatePath, "utf-8");
  } catch (e) {
    console.error("Template load error:", e.message);

    // fallback basic template to avoid crashes
    return `
      <h2>{{meetingName}}</h2>
      <p>Time slots:</p>
      <table>{{timeSlots}}</table>
      <p>&copy; {{year}}</p>
    `;
  }
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
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
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

    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Email error:", err.message);
    throw err;
  }
};

// API manual trigger
router.post("/send", async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    await sendEmail({ to, subject, text, html });
    res.status(200).json({ message: "Email sent OK" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
  console.log("Running scheduler check at:", new Date().toISOString());

  try {
    const now = new Date();

    const meetings = await Meeting.find({
      emailOption: true,
      email: { $exists: true, $ne: "" },
      deadline: { $lte: now },
    });

    console.log("Meetings found:", meetings.length);

    for (const meeting of meetings) {
      const slots = aggregateAndPrioritizeTimeSlots(meeting.participants || []);
      const rows = generateTimeSlotRows(slots);

      const template = loadMailTemplate();

      const html = template
        .replace("{{meetingName}}", meeting.meetingName)
        .replace("{{timeSlots}}", rows)
        .replace("{{year}}", new Date().getFullYear());

      await sendEmail({
        to: meeting.email,
        subject: `Reminder: ${meeting.meetingName}`,
        html,
      });

      meeting.emailOption = false;
      await meeting.save();
    }
  } catch (err) {
    console.error("Scheduler error:", err.message);
  }
};

// Scheduler: runs every minute
schedule.scheduleJob("*/1 * * * *", () => {
  console.log("Scheduler:", new Date().toLocaleString());
  checkAndSendEmails();
});

export default router;
