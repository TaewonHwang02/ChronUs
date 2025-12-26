import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({
      success: false,
      error: "Missing to, subject, or text",
    });
  }

  try {
    const data = await resend.emails.send({
      from: "Chronus <onboarding@resend.dev>",
      to,
      subject,
      html: `<p>${text}</p>`,
    });

    return res.status(200).json({
      success: true,
      id: data?.id,
    });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
