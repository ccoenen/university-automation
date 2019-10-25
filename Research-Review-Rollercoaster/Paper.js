const crypto = require('crypto');

const SALT = 'ohai, this will be changed for the actual run. For sure.';

module.exports = class Paper {
	constructor(author, authorDirectory, filename) {
		this.author = author;
		this.authorTeam;
		this.authorDirectory = authorDirectory;
		this.filename = filename;
		this.randomIdentifier = 'uninitialized';
		this.reviewing = [];
		this.reviewedBy = [];
	}

	setRandomIdentifier() {
		const hash = crypto.createHash('sha256');
		hash.update(this.author + SALT);
		this.randomIdentifier = hash.digest('hex').substr(0,6);
	}

	randomReviewName(paper) {
		return `${paper.randomIdentifier}-${this.randomIdentifier}`;
	}

	toString() {
		return this.author;
	}

	allReviewedBy() {
		return `Paper by ${this.author} will be reviewed by ${this.reviewedBy.map(r=>r.author).join(', ')}`;
	}
};
