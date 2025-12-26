import nodemailer from "nodemailer";

export default async function handler(req, res) {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({
      success: false,
      error: "Missing to, subject, or text",
    });
  }

  const user = process.env.USER;
  const pass = process.env.APP_PASSWORD;

  if (!user || !pass) {
    console.error(
      "Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables"
    );
    return res.status(500).json({
      success: false,
      error:
        "Server mailer not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in environment",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || `Chronus <${user}>`,
      to,
      subject,
      text,
      html: `<p>${text}</p>`,
    });

    return res.status(200).json({
      success: true,
      id: info.messageId || info,
    });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || String(error),
    });
  }
}
