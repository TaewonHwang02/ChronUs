import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

console.log("User:", process.env.USER);
console.log("App password:", process.env.APP_PASSWORD ? "Loaded" : "Missing");

const sendEmail = async () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Chronus Test Email</title>
    <style>
      body {
        font-family: 'Poppins', Arial, sans-serif;
        background-color: #3F88C5;
        color: #1e293b;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      }
      .header {
        background-color: #3F88C5; /* bg-primary (yellow) */
        padding: 20px;
        text-align: center;
      }
      .header img {
        height: 48px;
      }
      .content {
        padding: 24px;
      }
      .content h1 {
        font-size: 22px;
        color: #1e293b;
        margin-bottom: 12px;
      }
      .content p {
        font-size: 15px;
        line-height: 1.6;
        color: #334155;
      }
      .footer {
        text-align: center;
        font-size: 13px;
        color: #94a3b8;
        padding: 16px;
        background-color: #f1f5f9;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img src="https://www.chronus.blog/logo.png" alt="Chronus Logo" width="48"/>
      </div>
      <div class="content">
        <h1>Hi Dan 👋</h1>
        <p>This is a test email sent from your Node.js server using <b>Nodemailer</b>.</p>
        <p>It’s styled to match your Chronus theme, using <code>bg-primary</code> and your brand logo.</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Chronus — All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Chronus" <${process.env.USER}>`,
      to: "danal0304@gmail.com",
      subject: "Chronus Email Test",
      html: htmlTemplate,
    });
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

sendEmail();
