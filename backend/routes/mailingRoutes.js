import express from "express";
import nodemailer from "nodemailer";
import Bottleneck from "bottleneck";
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

// Rate limiter for Resend API: keep safely under 2 requests/sec
const resendLimiter = new Bottleneck({ minTime: 600 });

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

// Primary mail sender: prefer Resend (HTTP API). Fallback to SMTP if RESEND_API_KEY is not set or Resend fails.
const sendEmail = async ({ to, subject, text, html }) => {
  // Try Resend first
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const fromAddress =
        process.env.RESEND_FROM ||
        process.env.MAIL_FROM ||
        "Chronus <onboarding@resend.dev>";

      const resp = await resend.emails.send({
        from: fromAddress,
        to,
        subject,
        html: html || `<p>${text || ""}</p>`,
        text: text || undefined,
      });

      // Log full response for diagnostics
      try {
        console.log("Resend response:", JSON.stringify(resp));
      } catch (e) {
        console.log("Resend response (raw):", resp);
      }

      if (resp && resp.id) {
        console.log("Resend sent (id):", resp.id);
      } else {
        console.warn(
          "Resend send returned no id; delivery may still be pending. Response:",
          resp
        );
      }

      return resp;
    } catch (err) {
      console.warn(
        "Resend send failed:",
        err && err.message ? err.message : err
      );
      if (err && err.stack) console.warn(err.stack);
      // fallthrough to SMTP fallback
    }
  }

  // SMTP fallback (nodemailer)
  const gmailUser = process.env.GMAIL_USER || process.env.USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    throw new Error(
      "No mail provider configured. Set RESEND_API_KEY or SMTP credentials (GMAIL_USER/USER and GMAIL_APP_PASSWORD/APP_PASSWORD)"
    );
  }

  // Try 465 (implicit TLS) then 587 (STARTTLS)
  const attempts = [
    { port: 465, secure: true, name: "465 (implicit TLS)" },
    { port: 587, secure: false, name: "587 (STARTTLS)", requireTLS: true },
  ];

  let lastErr = null;

  for (const attempt of attempts) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: attempt.port,
      secure: attempt.secure,
      auth: { user: gmailUser, pass: gmailPass },
      logger: true,
      debug: true,
      requireTLS: attempt.requireTLS || false,
      tls: { rejectUnauthorized: false },
    });

    try {
      console.log(
        `Attempting SMTP verify on port ${attempt.port} (${attempt.name})`
      );
      await transporter.verify();
      console.log(`SMTP verify succeeded on port ${attempt.port}`);

      const info = await transporter.sendMail({
        from: `"Chronus" <${gmailUser}>`,
        to,
        subject,
        text,
        html,
      });

      console.log("Email sent via SMTP:", info.messageId);
      return info;
    } catch (err) {
      lastErr = err;
      console.warn(
        `SMTP attempt on port ${attempt.port} failed:`,
        err && err.message ? err.message : err
      );
      if (err && err.response) console.warn("response:", err.response);
      if (err && err.responseCode)
        console.warn("responseCode:", err.responseCode);
      if (err && err.code) console.warn("code:", err.code);
    }
  }

  console.error(
    "All SMTP attempts failed",
    lastErr && lastErr.message ? lastErr.message : lastErr
  );
  throw lastErr || new Error("All SMTP attempts failed");
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
      console.log(
        `Processing meeting ${
          meeting._id
        } deadline:${meeting.deadline?.toISOString()} emailOption:${
          meeting.emailOption
        }`
      );
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

      console.log(`Sent email for meeting ${meeting._id} to ${meeting.email}`);

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

// Debug endpoint: shows meetings that would be picked up by the scheduler right now
router.get("/debug", async (req, res) => {
  try {
    const now = new Date();
    const due = await Meeting.find({
      emailOption: true,
      email: { $exists: true, $ne: "" },
      deadline: { $lte: now },
    })
      .select("_id meetingName email deadline participants")
      .lean()
      .limit(100);

    res.json({ count: due.length, meetings: due });
  } catch (err) {
    console.error(
      "Debug endpoint error:",
      err && err.message ? err.message : err
    );
    res.status(500).json({ error: err.message });
  }
});
