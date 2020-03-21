const { Choice } = require('./Choice');

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
	}
}

module.exports = {
	Voter
};
