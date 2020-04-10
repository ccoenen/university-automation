class Voter {
	constructor(name, choices = []) {
		this.name = name;
		this.userid = '';
		this.choices = choices;
		this.choicesByPriority = [];
		this.assignedOptions = [];
		this.maximumAssignableOptions = Infinity;
	}


	toString() {
		return `[Voter ${this.name} (${this.userid}) ${this.choices.join(', ')}]`;
	}
}

module.exports = {
	Voter
};
