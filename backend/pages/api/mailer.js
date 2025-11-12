// pages/api/mailer.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  const { to, subject, text } = req.body;

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
    // Verify connection configuration
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error("SMTP connection error:", error);
          reject(error);
        } else {
          console.log("SMTP server is ready to take messages");
          resolve(success);
        }
      });
    });

    // Send the email
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: process.env.USER,
          to,
          subject,
          text,
        },
        (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        }
      );
    });

    console.log("Message sent:", info.messageId);
    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
