class Option {
	constructor(name = '') {
		this.name = name;
		this.popularity;
		this.assignedVoters = [];
		this.maximumAssignableVoters = Infinity;
	}

	toString() {
		return `[Option ${this.name}]`;
	}
}

module.exports = {
	Option
};
