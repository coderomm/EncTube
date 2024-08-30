var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;

var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';

var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendResetPasswordEmail(toEmail, toName, templateId, resetPasswordLink) {
  var sendSmtpEmail = {
    to: [{
      email: toEmail,
      name: toName
    }],
    templateId: templateId,
    params: {
      editorName: toName,
      resetPasswordLink: resetPasswordLink
    },
    headers: {
      'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
    }
  };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Reset password link to editor sent successfully. Returned data:', data);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

module.exports = { sendResetPasswordEmail };