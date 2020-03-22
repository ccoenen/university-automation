// this is also the sorting order!
const PREFERENCE = {
	YES: 'yes',
	MAYBE: 'maybe',
	UNDEFINED: 'undefined',
	NO: 'no',
};

const SORT_ORDER = {
	'yes': 1,
	'maybe': 2,
	'undefined': 3,
	'no': 4
};


class Choice {
	constructor(name = '', preference = '', weight) {
		this.name = name;
		this.preference = preference;
		this.weight = weight;
	}

	toString() {
		return `[Choice ${this.name}: ${this.preference}]`;
	}

	static compare(a, b) {
		if (a instanceof Choice && b instanceof Choice) {
			return Math.max(-1, Math.min(SORT_ORDER[a.preference] - SORT_ORDER[b.preference], 1));
		} else {
			throw new Error('one of the compared elements is not an instance of `Choice`');
		}
	}
}

module.exports = {
	Choice,
	PREFERENCE
};
