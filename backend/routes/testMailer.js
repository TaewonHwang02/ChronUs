import express from "express";
import { Resend } from "resend";

const router = express.Router();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/test", async (req, res) => {
  console.log("🔥 Test email route called");

  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res
      .status(400)
      .json({ error: "Missing to, subject, or text in request body" });
  }

  try {
    const email = await resend.emails.send({
      from: "Chronus <onboarding@resend.dev>", // you can later change this to: "Chronus <noreply@chronus.blog>"
      to,
      subject,
      html: `
        <h2>Production Email Test</h2>
        <p>${text}</p>
        <p>If you're reading this, the production mailer works on Vercel 🎉</p>
      `,
    });

    console.log("✅ Email sent:", email.id);

    res.status(200).json({
      success: true,
      emailId: email.id,
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
