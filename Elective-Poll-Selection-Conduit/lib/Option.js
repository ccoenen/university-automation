class Option {
	constructor(name = '') {
		this.name = name;
		this.popularity;
		this.assignedVoters = [];
	}

	toString() {
		return `[Option ${this.name}]`;
	}
}

module.exports = {
	Option
};
