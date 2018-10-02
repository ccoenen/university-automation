const fs = require('fs');

function emailMatcher(path) {
	var mails = fs.readFileSync(path).toString().split("\n");
	mails = mails.map((mail) => {
		return mail.toLowerCase();
	});

	return function matcher(user) {
		var output = null;
		mails.forEach((mail) => {
			if (mail.toLowerCase().indexOf(user.userid.toLowerCase()) > -1) {
				// console.log("found by userid match: %s -> %s", user.userid, mail);
				output = mail;
			}
		});
		if (!output) { console.error('NO MATCH FOR ', user); }
		return output;
	};
}

module.exports = emailMatcher;
