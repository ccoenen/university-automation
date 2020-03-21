const HTMLParser = require('node-html-parser');

const { Voter } = require('./Voter.js');
const { Choice, PREFERENCE } = require('./Choice.js');

const USERID_REGEX = /^\/avatar\/(.+)\/32$/;

module.exports = {
	findVoters: function (htmlDomLike) {
		const output = [];
		htmlDomLike.querySelectorAll('.vote-table div').forEach((row) => {
			if (row.classNames.includes('header')) { return false; }
			const name = row.querySelector('.user-name').text.trim();
			const voter = new Voter(name);

			const img = row.querySelector('img');
			if (img) {
				const match = img.getAttribute('src').match(USERID_REGEX);
				if (match) {
					voter.userid = match[1];
				}
			}

			const choices = row.querySelectorAll('.vote-table-item');
			voter.choices = choices.map((c) => {
				const output = new Choice();

				if (c.classNames.includes('yes')) {
					output.preference = PREFERENCE.YES;
				} else if (c.classNames.includes('maybe')) {
					output.preference = PREFERENCE.MAYBE;
				} else if (c.classNames.includes('no')) {
					output.preference = PREFERENCE.NO;
				} else {
					output.preference = PREFERENCE.UNDEFINED;
				}

				return output;
			});

			output.push(voter);
		});

		if (output.length < 1) { throw new Error('no voters found in document'); }
		return output;
	},


	findOptions: function (htmlDomLike) {
		const output = htmlDomLike.querySelectorAll('.vote-header .text-box').map((h) => h.text.trim());
		if (output.length < 1) { throw new Error('no options found in document'); }
		return output;
	},


	parse: function (htmlString) {
		const output = {};
		const root = HTMLParser.parse(htmlString);
		output.options = module.exports.findOptions(root);
		output.voters = module.exports.findVoters(root);

		return output;
	},


	resolveOptionNames: function (data) {
		data.voters.forEach((voter) => {
			voter.choices.forEach((choice, index) => {
				choice.name = data.options[index];
			});
		});
	}
};
