const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const helpers = require('./helpers');

module.exports = class Paper {
	constructor(author, authorDirectory, filename) {
		this.author = author;
		this.authorTeam;
		this.authorDirectory = authorDirectory;
		this.filename = filename;
		this.randomIdentifier = 'uninitialized';
		this.reviewing = [];
		this.reviewedBy = [];
		this.reviewedByRaw = []; // temporary variable to make reading from CSV possible
		this.supervisor = '';
		this.title = '';
		this.titlePages = 1;
	}

	setRandomIdentifier(salt) {
		const hash = crypto.createHash('sha256');
		hash.update(this.author + salt);
		this.randomIdentifier = hash.digest('hex').substr(0,6);
	}

	allReviewedBy() {
		return `Paper by ${this.author} (${this.randomIdentifier}) will be reviewed by ${this.reviewedBy.map(r=>r.author).join(', ')}`;
	}

	toString() {
		return this.author;
	}

	collectReviews(target) {
		if (!target) { throw 'please set a target to collect the reviews in'; }
		const reviewCollectionStream = fs.createWriteStream(target, {flag: 'w'}); // always overwrite

		const REVIEW_HEADER = `Reviews for ${this.author}\n===\n\nThese reviews belong to ${path.basename(this.filename)}.`;
		reviewCollectionStream.write(REVIEW_HEADER);

		this.reviewedBy.forEach((reviewer, index) => {
			const singleReview = fs.readFileSync(helpers.reviewPath(this, reviewer, '.txt'));
			reviewCollectionStream.write(`\n\n***\nReview ${index+1}\n----\n`);
			reviewCollectionStream.write(singleReview);
		});

		reviewCollectionStream.end();
	}

	toCSV() {
		const csv = {
			randomIdentifier: this.randomIdentifier,
			author: this.author,
			titlePages: this.titlePages,
			title: this.title,
			authorTeam: this.authorTeam,
			authorDirectory: this.authorDirectory,
			supervisor: this.supervisor,
			filename: this.filename,
		};
		this.reviewedBy.forEach((r, i) => {
			csv[`reviewedBy${i+1}`] = r.randomIdentifier;
		});
		return csv;
	}

	static fromCSV(csvData) {
		const p = new Paper(csvData.author, csvData.authorDirectory, csvData.filename);
		p.randomIdentifier = csvData.randomIdentifier;
		p.authorTeam = csvData.authorTeam;
		p.reviewedByRaw = [];
		p.supervisor = csvData.supervisor;
		p.titlePages = parseInt(csvData.titlePages, 10) || 0;
		p.title = csvData.title;
		for (var key of Object.keys(csvData)) {
			if (key.startsWith('reviewedBy')) {
				if (csvData[key]) {
					p.reviewedByRaw.push(csvData[key]);
				}
			}
		}
		return p;
	}

	static findIn(basepath, nameRegex, filenameConvention) {
		return new Promise((resolve, reject) => {
			fs.readdir(basepath, (err, result) => {
				if (err) return reject(err);
				const names = result.map((input) => {
					const author = input.match(nameRegex).groups.author;
					const authorDir = path.resolve(basepath,input);
					let files = fs.readdirSync(authorDir);
					files = files.filter((f) => {
						// ignoring our own files
						return f.endsWith('.pdf') && !f.startsWith('review-');
					});
					if (files.length !== 1) {
						return reject(`not exactly one file in ${input}, instead found ${files}.`);
					}
					const firstFile = files[0];
					const paper = new Paper(author, authorDir, path.resolve(basepath, input, firstFile));
					const match = firstFile.match(filenameConvention);
					if (match && match.groups && match.groups.title) {
						paper.title = match.groups.title;
					} else {
						console.warn(`${input}/${firstFile} does not conform to naming standards.`);
					}

					return paper;
				});
				resolve(names);
			});
		});
	}
};
