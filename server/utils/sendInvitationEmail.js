// utils/sendInvitationEmail.js
const nodemailer = require('nodemailer');
const config = require('../config');

const sendInvitationEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS2,
    },
    debug: true
  });

  const mailOptions = {
    from: config.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Invitation email sent successfully');
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw new Error('Error sending invitation email'); // Ensure the error is propagated
  }
};

module.exports = sendInvitationEmail;
