import express from "express";
import nodemailer from "nodemailer";
import schedule from "node-schedule";
import Meeting from "../models/meetingSchema.js";
import User from "../models/User.js";

const router = express.Router();

// Setting-up stage of emailing function, and Gmail 2factor authentication password
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
  const maxParticipants = Math.max(...aggregatedSlots.map(slot => slot.participants.length));
  return aggregatedSlots.filter(slot => slot.participants.length === maxParticipants);
};

// For scheduled emailing to work, we need to check regularly for emailOption true and also emailDate has to be today
const checkAndSendEmails = async () => {
  try {
    const now = new Date();

    // All meetings that satisfy our needs
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

      // Prioritize only max participant slots
      const maxAggregatedSlots = aggregateAndPrioritizeTimeSlots(meeting.participants);
      const tableContent = formatTimeSlotTable(maxAggregatedSlots);

      // Email format (to fill in with actual user data)
      const emailContent = {
        to: user.email,
        subject: "Your Meeting Reminder",
        text: `Hello ${user.name},\n\nThis is a reminder for your scheduled meeting:\n\nMeeting Name: ${meeting.meetingName}\n${tableContent}\n\nBest regards,\n\nChronUs Team`,
      };

      await sendEmail(emailContent);

      // ***** Scheduler runs every minute so once we send, we tick emailOption to false to avoid spamming!!!
      meeting.emailOption = false;
      await meeting.save();
      console.log(`Email sent and emailOption updated for meeting ID: ${meeting._id}`);
    }
  } catch (error) {
    console.error("Error checking and sending emails:", error.message);
  }
};


// Scheduling to check the meeting schema every minute ("*/1 * * * *")
schedule.scheduleJob("*/1 * * * *", checkAndSendEmails);

export default router;
