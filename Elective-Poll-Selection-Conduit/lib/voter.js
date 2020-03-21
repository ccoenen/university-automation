module.exports = class Voter {
	constructor(name, choices = []) {
		this.name = name;
		this.userid = '';
		this.choices = choices;
	}

	toString() {
		return `[Voter ${this.name} (${this.userid}) ${this.choices.join(', ')}]`;
	}
};
