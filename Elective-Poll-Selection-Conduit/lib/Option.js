class Option {
	constructor(name = '') {
		this.name = name;
		this.popularity;
	}

	toString() {
		return `[Option ${this.name}]`;
	}
}

module.exports = {
	Option
};
