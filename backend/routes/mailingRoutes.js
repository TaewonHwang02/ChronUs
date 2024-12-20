import express from "express";
import nodemailer from "nodemailer";
import schedule from "node-schedule";
import Meeting from "../models/meetingSchema.js";
import User from "../models/User.js";

const router = express.Router();

const sendEmail = async ({ to, subject, text }) => {
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
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error.message);
  }
};

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

  // Convert the map into an array
  const aggregatedSlots = Array.from(timeSlotMap.values());

  // Determine the maximum number of participants
  const maxParticipants = Math.max(...aggregatedSlots.map(slot => slot.participants.length));

  // Filter slots to include only those with the maximum participants
  return aggregatedSlots.filter(slot => slot.participants.length === maxParticipants);
};

// Function to check and send emails for meetings with emailOption true
const checkAndSendEmails = async () => {
  try {
    const now = new Date();

    // Fetch all meetings with `emailOption: true` and `emailDate` that are due
    const meetings = await Meeting.find({
      emailOption: true,
      emailDate: { $lte: now },
    }).populate("participants");

    for (const meeting of meetings) {
      const user = await User.findOne({ uid: meeting.userID });
      if (!user) {
        console.error(`User not found for userID: ${meeting.userID}`);
        continue;
      }

      // Aggregate and prioritize time slots (only max participant slots)
      const maxAggregatedSlots = aggregateAndPrioritizeTimeSlots(meeting.participants);

      const tableContent = formatTimeSlotTable(maxAggregatedSlots);

      const emailContent = {
        to: user.email,
        subject: "Your Meeting Reminder",
        text: `Hello ${user.name},\n\nThis is a reminder for your scheduled meeting:\n\nMeeting Name: ${meeting.meetingName}\n${tableContent}\n\nBest regards,\n\nChronUs Team`,
      };

      await sendEmail(emailContent);

      // Mark the meeting's emailOption as false to prevent re-sending
      meeting.emailOption = false;
      await meeting.save();
      console.log(`Email sent and emailOption updated for meeting ID: ${meeting._id}`);
    }
  } catch (error) {
    console.error("Error checking and sending emails:", error.message);
  }
};


// Schedule the `checkAndSendEmails` function to run every minute
schedule.scheduleJob("*/1 * * * *", checkAndSendEmails);

export default router;
