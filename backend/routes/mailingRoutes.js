import express from "express";
import nodemailer from "nodemailer";
import schedule from "node-schedule";
import Meeting from "../models/meetingSchema.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// Load HTML template
const loadMailTemplate = () => {
  const templatePath = path.join(process.cwd(), "mailFormat.html");
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

// Setting-up stage of emailing function, and Gmail 2factor authentication password
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
      from: process.env.USER,
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

// Later when sending the email, we need a template table to input the maximum participant slots
// Essentially what we'll send in the email
const formatTimeSlotTable = (aggregatedSlots) => {
  if (aggregatedSlots.length === 0) {
    return "No time slots available.";
  }

  let table = "\n\nTime Slots:\n";
  table += "Date         | Start Time | End Time  | Participants\n";
  table += "-------------|------------|-----------|---------------------\n";

  aggregatedSlots.forEach((slot) => {
    const participantNames = slot.participants.join(", ");
    table += `${slot.date} | ${slot.minTime}   | ${slot.maxTime}  | ${participantNames}\n`;
  });

  return table;
};

// Function to find the maximum number of participants in a block and only filter those
// For other emailing options, we could maybe implement other aggregations, but just this for noww
const aggregateAndPrioritizeTimeSlots = (participants) => {
  const timeSlotMap = new Map();
  // Grouping of overlapping slots
  // Merge date time and max time into slotKey to compare identical periods
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

  // Find slots with max number of participants and return those
  const aggregatedSlots = Array.from(timeSlotMap.values());
  const maxParticipants = Math.max(
    ...aggregatedSlots.map((slot) => slot.participants.length)
  );
  return aggregatedSlots.filter(
    (slot) => slot.participants.length === maxParticipants
  );
};

// For scheduled emailing to work, we need to check regularly for emailOption true and also emailDate has to be today
const checkAndSendEmails = async () => {
  try {
    const nowUtc = new Date(new Date().toISOString());
    const meetings = await Meeting.find({
      emailOption: true,
      emailDate: { $lte: nowUtc },
    }).populate("participants");

    for (const meeting of meetings) {
      const user = await User.findOne({ uid: meeting.userID });
      if (!user) {
        console.error(`User not found for userID: ${meeting.userID}`);
        continue;
      }

      const maxAggregatedSlots = aggregateAndPrioritizeTimeSlots(
        meeting.participants
      );
      const tableRows = generateTimeSlotRows(maxAggregatedSlots);

      // Load template and replace placeholders
      const template = loadMailTemplate();
      const emailHtml = template
        .replace("{{meetingName}}", meeting.meetingName)
        .replace("{{timeSlots}}", tableRows)
        .replace("Hello,", `Hello ${user.name},`);

      // Send HTML email
      await sendEmail({
        to: user.email,
        subject: `Reminder: ${meeting.meetingName}`,
        html: emailHtml, // <-- send as HTML
      });

      // Disable emailOption so it's sent only once
      meeting.emailOption = false;
      await meeting.save();
      console.log(
        `Email sent and emailOption updated for meeting ID: ${meeting._id}`
      );
    }
  } catch (error) {
    console.error("Error checking and sending emails:", error.message);
  }
};

// Scheduling to check the meeting schema every minute ("*/1 * * * *")
schedule.scheduleJob("*/1 * * * *", checkAndSendEmails);

export default router;
