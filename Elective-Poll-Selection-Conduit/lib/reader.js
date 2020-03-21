const HTMLParser = require('node-html-parser');

const Voter = require('./voter.js');

const USERID_REGEX = /^\/avatar\/(.+)\/32$/;

const VOTING_STATE = {
	YES: 'yes',
	MAYBE: 'maybe',
	NO: 'no',
	UNDEFINED: 'undefined',
};

module.exports = {
	VOTING_STATE: VOTING_STATE,

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
				if (c.classNames.includes('yes')) return VOTING_STATE.YES;
				if (c.classNames.includes('maybe')) return VOTING_STATE.MAYBE;
				if (c.classNames.includes('no')) return VOTING_STATE.NO;
				return VOTING_STATE.UNDEFINED;
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
	}
};
