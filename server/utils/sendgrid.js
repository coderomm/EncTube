var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';

// Uncomment below two lines to configure authorization using: partner-key
// var partnerKey = defaultClient.authentications['partner-key'];
// partnerKey.apiKey = 'YOUR API KEY';

var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

sendSmtpEmail = {
	to: [{
		email: 'omsharma9367@gmail.com',
		name: 'Om Sharma'
	}],
	templateId: 4,
	params: {
		channelName: 'O M O P Gaming',
		editorName: 'Editor Om',
        invitationLink:'https://mail.google.com/mail/u/0/?tab=rm&ogbl#all/FMfcgzQVzNqrlpzlVrBSlWjPZbTQxsGg',
	},
    params: {
		channelName: 'O M O P Gaming',
        channelURL,
		editorName: 'Editor Om',
        editorMail,
        videoTitle,
        privacyStatus,
        thumbnail,
        video,
        dashboardApprovalLink,
        oneClickApprovalLink,

        invitationLink:'https://mail.google.com/mail/u/0/?tab=rm&ogbl#all/FMfcgzQVzNqrlpzlVrBSlWjPZbTQxsGg',
	},
	headers: {
		'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
	}
};

apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {    
  console.error(error);
});