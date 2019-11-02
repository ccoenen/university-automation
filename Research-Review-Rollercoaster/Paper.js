const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

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
		this.title = '';
		this.titlePages = 1;
	}

	setRandomIdentifier(salt) {
		const hash = crypto.createHash('sha256');
		hash.update(this.author + salt);
		this.randomIdentifier = hash.digest('hex').substr(0,6);
	}

	randomReviewName(paper) {
		return `review-${paper.randomIdentifier}-${this.randomIdentifier}`;
	}

	allReviewedBy() {
		return `Paper by ${this.author} (${this.randomIdentifier}) will be reviewed by ${this.reviewedBy.map(r=>r.author).join(', ')}`;
	}

	toString() {
		return this.author;
	}

	toCSV() {
		const csv = {
			randomIdentifier: this.randomIdentifier,
			author: this.author,
			titlePages: this.titlePages,
			title: this.title,
			authorTeam: this.authorTeam,
			authorDirectory: this.authorDirectory,
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
		p.titlePages = csvData.titlePages;
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
					const author = input.match(nameRegex)[1];
					let files = fs.readdirSync(path.resolve(basepath,input));
					files = files.filter((f) => {
						// ignoring our own files
						return f.endsWith('.pdf') && !f.startsWith('review-');
					});
					if (files.length !== 1) {
						return reject(`not exactly one file in ${input}, instead found ${files}.`);
					} else if (!filenameConvention.test(files[0])) {
						console.warn(`${input}/${files[0]} does not conform to naming standards.`);
					}
					return new Paper(author, path.resolve(basepath, input), path.resolve(basepath, input, files[0]));
				});
				resolve(names);
			});
		});
	}
};
