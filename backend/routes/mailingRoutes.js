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

// Function to check and send emails for meetings with emailOption true
const checkAndSendEmails = async () => {
  try {
    // Get current date and time
    const now = new Date();

    // Fetch all meetings with `emailOption: true` and `emailDate` that are due
    const meetings = await Meeting.find({
      emailOption: true,
      emailDate: { $lte: now }, // Emails scheduled up to the current time
    });

    for (const meeting of meetings) {
      const user = await User.findOne({ uid: meeting.userID });
      if (!user) {
        console.error(`User not found for userID: ${meeting.userID}`);
        continue;
      }

      const emailContent = {
        to: user.email,
        subject: "Your Meeting Reminder",
        text: `Hello ${user.name},\n\nThis is a reminder for your scheduled meeting:\nMeeting Name: ${meeting.meetingName}\nStart Date: ${meeting.startdate}\nEnd Date: ${meeting.enddate}\n\nBest regards,\nChronUs`,
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
