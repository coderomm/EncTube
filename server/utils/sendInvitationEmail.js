// utils/sendInvitationEmail.js
const nodemailer = require('nodemailer');

const sendInvitationEmail = async (to, subject, text) => {
  if (!to || !subject || !text) {
    return res.status(400).send('To send a email all fields are required.');
  }
  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      logger: true,
      debug: true,
    });
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      text
    };

    const result = await transport.sendMail(mailOptions);
    console.log('Invitation Email sent:', result)
  } catch (error) {
    console.error('Error sending invitation email:', error);
    res.status(500).send(error);
  }
};

module.exports = sendInvitationEmail;
