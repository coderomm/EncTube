// utils/sendNotificationEmail.js
const nodemailer = require('nodemailer');
const config = require('../config');

const sendNotificationEmail = async (subject, text, to, videoId) => {
    const transporter = nodemailer.createTransport({
        service: config.EMAIL_SERVICE,
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: 'omopyt2020@gmail.com',
        to,
        subject,
        html: `
      <p>${text}</p>
      <p>Video Title: ${subject}</p>
      <p>
        <a href="http://localhost:3000/approve?action=approve&videoId=${videoId}">Approve</a> |
        <a href="http://localhost:3000/approve?action=reject&videoId=${videoId}">Reject</a> |
        <a href="http://localhost:3000/approve?action=hold&videoId=${videoId}">Hold</a>
      </p>
    `
    };

    await transporter.sendMail(mailOptions);
    try {
        await transporter.sendMail(mailOptions);
        console.log('Notification email sent successfully');
    } catch (error) {
        console.error('Error sending notification email:', error);
    }
};

module.exports = sendNotificationEmail;
