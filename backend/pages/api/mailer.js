// pages/api/mailer.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  const { to, subject, text } = req.body;

  try {
    let info = await transporter.sendMail({
      from: process.env.USER,
      to,
      subject,
      text,
    });

    console.log("Message sent: %s", info.messageId);
    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
