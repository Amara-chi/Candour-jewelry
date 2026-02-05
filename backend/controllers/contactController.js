import { sendEmail } from '../utils/emailService.js';

const getRecipients = () => {
  const configured = process.env.ADMIN_EMAILS
    ?.split(',')
    .map((email) => email.trim())
    .filter(Boolean);

  if (configured && configured.length > 0) {
    return configured;
  }

  if (process.env.GMAIL_USER || process.env.EMAIL_USER) {
    return [process.env.GMAIL_USER || process.env.EMAIL_USER];
  }

  return [];
};

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject, and message.'
      });
    }

    const recipients = getRecipients();

    if (!recipients.length) {
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured.'
      });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      </div>
    `;

    const subjectLine = `Contact Form: ${subject}`;
    const emailResponse = await sendEmail(recipients.join(','), subjectLine, htmlContent);

    if (!emailResponse.success) {
      return res.status(500).json({
        success: false,
        message: emailResponse.error || 'Failed to send message.'
      });
    }

    return res.json({
      success: true,
      message: 'Message sent successfully.'
    });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message.'
    });
  }
};
