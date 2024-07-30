// utils/sendNotificationEmail.js
const nodemailer = require('nodemailer');

const sendNotificationEmail = async (subject, text, to, videoId) => {
    if (!subject || !text || !to || !videoId) {
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

        const response = await transport.sendMail(mailOptions);
        console.log('Video notification from editor:', response)
    } catch (error) {
        console.error('Error sending invitation email:', error);
        res.status(500).send(error);
    }
};

module.exports = sendNotificationEmail;
