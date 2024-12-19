import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/send", async (req, res) => {
  const { to, subject, text } = req.body;

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

    res.status(200).json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
