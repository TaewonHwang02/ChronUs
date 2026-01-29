export default async function handler(req, res) {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({
      success: false,
      error: "Missing to, subject, or text",
    });
  }

  // Prefer Resend API
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
        html: `<p>${text}</p>`,
        text,
      });

      return res.status(200).json({ success: true, id: resp.id });
    } catch (err) {
      console.error(
        "Resend send error:",
        err && err.message ? err.message : err
      );
      return res
        .status(500)
        .json({ success: false, error: err.message || String(err) });
    }
  }

  // If Resend not configured, fallback to SMTP (nodemailer)
  try {
    const nodemailerModule = await import("nodemailer");
    const nodemailer = nodemailerModule.default || nodemailerModule;

    const user = process.env.GMAIL_USER || process.env.USER;
    const pass = process.env.GMAIL_APP_PASSWORD || process.env.APP_PASSWORD;

    if (!user || !pass) {
      console.error("Missing SMTP credentials");
      return res
        .status(500)
        .json({ success: false, error: "No mail provider configured" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || `Chronus <${user}>`,
      to,
      subject,
      text,
      html: `<p>${text}</p>`,
    });

    return res.status(200).json({ success: true, id: info.messageId || info });
  } catch (error) {
    console.error("SMTP fallback error:", error);
    return res
      .status(500)
      .json({ success: false, error: error.message || String(error) });
  }
}
