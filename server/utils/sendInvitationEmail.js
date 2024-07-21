// utils/sendInvitationEmail.js
const nodemailer = require('nodemailer');
const config = require('../config');

const sendInvitationEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: config.EMAIL_SERVICE,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: config.EMAIL_USER,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
  try {
    await transporter.sendMail(mailOptions);
    console.log('Invitation email sent successfully');
  } catch (error) {
    console.error('Error sending invitation email:', error);
  }
};

module.exports = sendInvitationEmail;
