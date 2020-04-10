class Voter {
	constructor(name, choices = []) {
		this.name = name;
		this.userid = '';
		this.choices = choices;
		this.choicesByPriority = [];
		this.assignedOptions = [];
		this.happiness = 0;
		this.maximumAssignableOptions = Infinity;
	}


	getHappiness() {
		return Math.round(this.happiness/this.maximumAssignableOptions*100);
	}


	toString() {
		return `[Voter ${this.name} (${this.userid}) ${this.choices.join(', ')}]`;
	}
}

module.exports = {
	Voter
};
