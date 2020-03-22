const { Choice, PREFERENCE } = require('./Choice');

class Voter {
	constructor(name, choices = []) {
		this.name = name;
		this.userid = '';
		this.choices = choices;
		this.optionsByPriority = [];
	}


	toString() {
		return `[Voter ${this.name} (${this.userid}) ${this.choices.join(', ')}]`;
	}


	prepareOptionsByPriority() {
		this.optionsByPriority = this.choices.slice(0); // clones the array
		this.optionsByPriority.sort(Choice.compare);

		const counter = {};
		this.optionsByPriority.forEach((option) => {
			counter[option.preference] = (counter[option.preference] || 0) + 1;
		});
		this.optionsByPriority.forEach((option) => {
			option.weight = 1 / counter[option.preference];
		});
	}
}

module.exports = {
	Voter
};
