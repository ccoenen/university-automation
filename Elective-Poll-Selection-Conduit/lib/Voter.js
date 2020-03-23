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
}

module.exports = {
	Voter
};
