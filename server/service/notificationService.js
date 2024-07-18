const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'omopyt2020@gmail.com',
    pass: 'hcbc lqvv vfuo xawg' // Use the 16-character App Password here
  }
});

const sendEmailNotification = async (subject, text, to, videoId) => {
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

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendEmailNotification };
