const twilio = require('twilio');
const slack = require('@slack/web-api');

const twilioClient = twilio('your-twilio-account-sid', 'your-twilio-auth-token');
const slackClient = new slack.WebClient('your-slack-token');

exports.sendWhatsAppNotification = async (message, to) => {
  await twilioClient.messages.create({
    body: message,
    from: 'whatsapp:+14155238886',
    to: `whatsapp:${to}`,
  });
};

exports.sendSlackNotification = async (message, channel) => {
  await slackClient.chat.postMessage({ channel, text: message });
};
