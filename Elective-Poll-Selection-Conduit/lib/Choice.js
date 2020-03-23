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
	constructor(option, preference = '') {
		this.option = option;
		this.preference = preference;
	}

	toString() {
		return `[Choice ${this.option}: ${this.preference}]`;
	}

	static compare(a, b) {
		if (!(a instanceof Choice && b instanceof Choice)) {
			throw new Error('one of the compared elements is not an instance of `Choice`');
		}

		// most preferred first
		const firstCheck = Math.max(-1, Math.min(SORT_ORDER[a.preference] - SORT_ORDER[b.preference], 1));
		if (firstCheck !== 0) {
			return firstCheck;
		}

		// least popular first
		return Math.max(-1, Math.min(a.option.popularity - b.option.popularity, 1));
	}
}

module.exports = {
	Choice,
	PREFERENCE
};
