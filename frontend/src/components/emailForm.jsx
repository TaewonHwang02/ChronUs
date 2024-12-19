import React, { useState } from "react";

const EmailForm = () => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    text: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      const result = await response.json();
      setStatus(`Email sent successfully! Message ID: ${result.messageId}`);
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("Failed to send email. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Send an Email</h1>
      <div>
        <label>Recipient Email:</label>
        <input
          type="email"
          name="to"
          value={formData.to}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Subject:</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Message:</label>
        <textarea
          name="text"
          value={formData.text}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Send Email</button>
      {status && <p>{status}</p>}
    </form>
  );
};

export default EmailForm;
