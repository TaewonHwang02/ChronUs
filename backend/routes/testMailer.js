import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Minimal test email route
router.post("/test", async (req, res) => {
  console.log("Test email route called");

  // Check environment variables
  console.log("USER:", process.env.USER);
  console.log("APP_PASSWORD:", process.env.APP_PASSWORD ? "Loaded" : "Missing");

  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res
      .status(400)
      .json({ error: "Missing to, subject, or text in request body" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log("SMTP server is ready");

    const info = await transporter.sendMail({
      from: `"Test" <${process.env.USER}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.messageId);
    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
