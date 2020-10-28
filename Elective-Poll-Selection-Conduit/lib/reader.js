const HTMLParser = require('node-html-parser');

const { Option } = require('./Option.js');
const { Voter } = require('./Voter.js');
const { Choice, PREFERENCE } = require('./Choice.js');

const USERID_REGEX = /^\/avatar\/(.+)\/32$/;

module.exports = {
	applyVoterMaximumPerOption: function (options, maximumNumbers) {
		for (const option of options) {
			const max = maximumNumbers[option.name];
			if (max < 1) {
				console.warn(`no maximum defined for ${option.name}`);
			} else {
				option.maximumAssignableVoters = max;
			}
		}
	},


	applyOptionMaximumPerVoter: function (voters, maximumNumbers) {
		for (const voter of voters) {
			const max = maximumNumbers[voter.userid];
			if (max) {
				voter.maximumAssignableOptions = max;
			}
		}
	},


	findVoters: function (htmlDomLike) {
		const output = [];
		htmlDomLike.querySelectorAll('.vote-table div.user-item').forEach((row, index) => {
			const name = row.querySelector('.user-item__name').text.trim();
			const voter = new Voter(name);

			const img = row.querySelector('img');
			if (img) {
				const match = img.getAttribute('src').match(USERID_REGEX);
				if (match) {
					voter.userid = match[1];
				}
			}

			const choices = htmlDomLike.querySelectorAll('.vote-table__vote-row')[index].querySelectorAll('.vote-table-vote-item');
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
		const output = htmlDomLike.querySelectorAll('.vote-table__header .option-item__option--text').map((h) => {
			return new Option(h.text.trim());
		});
		if (output.length < 1) { throw new Error('no options found in document'); }
		return output;
	},


	parseHTML: function (htmlString) {
		const output = {};
		const root = HTMLParser.parse(htmlString);
		output.options = module.exports.findOptions(root);
		output.voters = module.exports.findVoters(root);

		return output;
	},


	resolveOptionNames: function (data) {
		data.voters.forEach((voter) => {
			voter.choices.forEach((choice, index) => {
				choice.option = data.options[index];
			});
		});
	},


	setMissingUserIds: function (voters, idMap) {
		for (const voter of voters) {
			if (voter.userid) continue;
			if (idMap[voter.name]) {
				voter.userid = idMap[voter.name];
			} else {
				console.error(`* no userid found for '${voter.name}': ''`);
			}
		}
	}
};
