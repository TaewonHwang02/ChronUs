import express from "express";

const router = express.Router();

// This route will dynamically import providers so the app doesn't crash at startup
// if a package like `resend` isn't installed. It prefers Resend if RESEND_API_KEY
// is configured, otherwise it will use Gmail SMTP via nodemailer when GMAIL_USER
// and GMAIL_APP_PASSWORD exist.

router.post("/test", async (req, res) => {
  console.log("🔥 Test email route called");

  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res
      .status(400)
      .json({ error: "Missing to, subject, or text in request body" });
  }

  const html = `
    <h2>Production Email Test</h2>
    <p>${text}</p>
    <p>If you're reading this, the production mailer works 🎉</p>
  `;

  try {
    // If RESEND_API_KEY is present, try to send via Resend.
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const email = await resend.emails.send({
          from: process.env.RESEND_FROM || "Chronus <onboarding@resend.dev>",
          to,
          subject,
          html,
        });

        console.log("✅ Resend sent:", email.id);
        return res
          .status(200)
          .json({ success: true, provider: "resend", id: email.id });
      } catch (err) {
        // If import failed or send failed, log and fall through to next option
        console.warn(
          "Resend send failed or module missing:",
          err && err.message ? err.message : err
        );
      }
    }

    // Fallback: use Gmail SMTP if configured (suitable for Render backends)
    // Prefer explicit GMAIL_* env vars but accept older USER/APP_PASSWORD names as fallback
    const gmailUser = process.env.GMAIL_USER || process.env.USER;
    const gmailPass =
      process.env.GMAIL_APP_PASSWORD || process.env.APP_PASSWORD;
    if (gmailUser && gmailPass) {
      try {
        const nodemailerModule = await import("nodemailer");
        const nodemailer = nodemailerModule.default || nodemailerModule;

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
          logger: true,
          debug: true,
        });

        // Verify connection configuration before sending — helps debug deployment issues
        try {
          await transporter.verify();
          console.log("SMTP connection verified");
        } catch (verifyErr) {
          console.warn(
            "SMTP verify failed:",
            verifyErr && verifyErr.message ? verifyErr.message : verifyErr
          );
          // continue to attempt send, but verification failing usually indicates network/auth issues
        }

        const info = await transporter.sendMail({
          from: process.env.MAIL_FROM || `Chronus <${gmailUser}>`,
          to,
          subject,
          text,
          html,
        });

        console.log("✅ Gmail sent:", info.messageId || info);
        return res.status(200).json({
          success: true,
          provider: "gmail",
          id: info.messageId || info,
        });
      } catch (err) {
        // Log detailed fields that often appear in SMTP/Nodemailer errors
        console.warn(
          "Gmail send failed:",
          err && err.message ? err.message : err
        );
        if (err && err.response) console.warn("response:", err.response);
        if (err && err.responseCode)
          console.warn("responseCode:", err.responseCode);
        if (err && err.code) console.warn("code:", err.code);
        if (err && err.stack) console.warn(err.stack);
      }
    }

    // If we reach here, no provider succeeded or none configured
    return res.status(500).json({
      success: false,
      error:
        "No mail provider configured or all providers failed. Set RESEND_API_KEY or GMAIL_USER & GMAIL_APP_PASSWORD",
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return res
      .status(500)
      .json({ success: false, error: error.message || String(error) });
  }
});

export default router;
