const Promise = require('bluebird');
const fs = require('fs');
const nodemailer = require('nodemailer');
const hogan = require('hogan.js');

var CONFIG;
var template;

// create reusable transporter object using the default SMTP transport
var transporter;

function sendToAll(users) {
	return Promise.mapSeries(users, send, {concurrency: 1});
}

function send(user) {
	console.log("Sending Mail to " + user.userid);
	return new Promise((fulfill, reject) => {
		if (!user.email) { reject("No email specified for " + user.userid); return; }
		if (!user.userid) { reject("No userid specified for " + user.email); return; }
		if (!user.password) { reject("No password specified for " + user.userid); return; }

		user.server = 'https://' + CONFIG.hostname;

		var mailOptions = {
			from: CONFIG.mail_from,
			to: user.email,
			bcc: CONFIG.mail_bcc_recipients,
			subject: CONFIG.mail_subject,
			text: template.render(user)
		};

		if (CONFIG.mail_reply_to) {
			mailOptions.replyTo = CONFIG.mail_reply_to;
		}

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
			if(error){
				reject(error);
			}
			fulfill(info);
		});

	});
}

module.exports = {
	init: function (config) {
		CONFIG = config;
		transporter = nodemailer.createTransport(CONFIG.smtp_auth);
		template = hogan.compile(fs.readFileSync(CONFIG.mail_template_file).toString());
	},
	sendToAll,
	send
};
