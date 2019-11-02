const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const csv = require('fast-csv');
const pdftk = require('node-pdftk');

const Paper = require('./Paper');

const BASEPATH = 'this will be changed.';
const NAME_REGEX = /^some basename (.+)$/;
const FILENAME_CONVENTION = /^\w{1,2}\d_\d{6}_(.+)_(.+)\.(.+)/;
const PDFTK_PATH = 'C:/Tools/PDFtk/bin/pdftk.exe';
pdftk.configure({bin: PDFTK_PATH});
const REVIEW_TEMPLATE_PATH = 'somewhere/review-template.txt';
const TEAM_FILE = 'some-csv-somewhere.csv';
const MAPPING_FILE = 'mappings.csv';
const RANDOM_IDENTIFIER_SALT = 'ohai, this will be changed for the actual run. For sure.';

const highlight = chalk.redBright.bgBlack;

function assignRandomIdentifiers(papers) {
	papers.forEach(paper => paper.setRandomIdentifier(RANDOM_IDENTIFIER_SALT));
	return papers;
}

function readTeamsFromFile(papers) {
	return new Promise((resolve, reject) =>  {

		const fileStream = fs.createReadStream(TEAM_FILE);

		const csvStream = csv({headers: true, trim: true, comment: '#'})
			.on('data', (data) => {
				const paper = papers.find((p) => p.author === data.Name);
				if (paper) {
					paper.authorTeam = data.Gruppe;
				} else {
					console.warn(`No paper found for ${data.Name}`);
				}
			})

			.on('end', () => {
				papers.forEach(p => {
					if (!p.authorTeam) console.warn(`No Team found for ${p.author}`);
				});
				resolve(papers);
			})

			.on('error', (err) => {
				return reject(`Failed to parse ${TEAM_FILE}: ${err.message}`);
			});

		fileStream.pipe(csvStream);
	});
}

function assignReviewers(papers) {
	let reviewers = []; // this way is very convoluted, but continuing in the place where the previous assignment left off gives better result than starting from the top of the list every time.
	papers.forEach((paper) => {
		let randomReviewer;
		const rejectionReasons = [];
		let tieBreaker = false;
		while (paper.reviewedBy.length < 3) {
			if (reviewers.length === 0) {
				if (tieBreaker) {
					console.error(`no solution for ${highlight(paper.author)} (${paper.randomIdentifier}) because\n${rejectionReasons.map(r => `- ${r}`).join('\n')}`);
					console.error(`  conclusion: ${paper.allReviewedBy()}`);
					break; // ends this paper's assignments
				} else {
					reviewers = [].concat(papers); // cloning the array
					tieBreaker = true;
				}
			}
			randomReviewer = reviewers.pop();
			const rejection = checkAuthorPair(paper, randomReviewer);
			if (rejection) {
				rejectionReasons.push(rejection);
			} else {
				paper.reviewedBy.push(randomReviewer);
				randomReviewer.reviewing.push(paper);
			}
		}
	});
	return papers;
}

function resolveReviewer(papers) {
	// in contrast to assignReviewers this does not perform ANY checks!
	// this is intentional, so you can change the mappings file in any way
	// that you like.
	papers.forEach((paper) => {
		paper.reviewedByRaw.forEach((reviewerIdentifier) => {
			const reviewer = papers.find((p) => p.randomIdentifier === reviewerIdentifier);
			if (!reviewer) {throw `Reviewer ${reviewerIdentifier} not found for the paper by ${paper.author}`;}
			paper.reviewedBy.push(reviewer);
			reviewer.reviewing.push(paper);
		});
	});

	return papers;
}

function checkAuthorPair(paper, reviewer) {
	if (paper.author === reviewer.author) {
		return `${reviewer.author} can't review themselves`;
	} else if (paper.reviewedBy.includes(reviewer)) {
		return `${reviewer.author} already reviews this one`;
	} else if (paper.reviewing.includes(reviewer)) {
		return `${reviewer.author} is under review by ${paper.author}. No quid-pro-quos.`;
	} else if (paper.authorTeam && reviewer.authorTeam && paper.authorTeam === reviewer.authorTeam) {
		return `${reviewer.author} and ${paper.author} are on team ${paper.authorTeam}`;
	} else if (paper.reviewedBy.map(r => r.authorTeam).includes(reviewer.authorTeam)) {
		return `${reviewer.author}'s Team ${paper.authorTeam} already reviews this. Must be one of: ${paper.reviewedBy.join(',')}`;
	} else if (reviewer.reviewing.length >= 3) {
		return `${reviewer.author} already has a lot of reviews to do`;
	}
	// else return nothing = no rejection
}

function checks(papers) {
	papers.forEach(p => {
		if (p.reviewing.length !== 3) console.warn(`${p.author} is not supposed to review ${p.reviewing.length} people (${p.reviewing})`);
		if (p.reviewedBy.length !== 3) console.warn(`${p.author} is not supposed to be reviewed by ${p.reviewedBy.length} people (${p.reviewedBy})`);
	});
	return papers;
}

function print(papers) {
	papers.forEach(paper => console.log(paper.allReviewedBy()));
	return papers;
}

function writeMappingCSV(papers, file) {
	const stream = csv.format({
		headers: true
	});

	stream.pipe(fs.createWriteStream(file));
	papers.forEach((paper) => {
		stream.write(paper.toCSV());
	});
	stream.end();

	return papers;
}

function readMappingCSV(file) {
	return new Promise((resolve, reject) =>  {
		const fileStream = fs.createReadStream(file);
		const papers = [];

		const csvStream = csv({headers: true, trim: true, comment: '#'})
			.on('data', (data) => {
				papers.push(Paper.fromCSV(data));
			})

			.on('end', () => {
				resolve(papers);
			})

			.on('error', (err) => {
				return reject(`Failed to parse ${MAPPING_FILE}: ${err.message}`);
			});
		fileStream.pipe(csvStream);
	}).then(resolveReviewer);
}

function writeToDisk(papers) {
	let currentPromise = Promise.resolve();
	papers.forEach(paper => {
		paper.reviewedBy.forEach(reviewer => {
			currentPromise = currentPromise.then(() => { // current = current.then chains it!
				console.debug(`converting ${paper.filename} to ${reviewer.randomReviewName(paper)}`);
				return pdftk
					.input(paper.filename)
					.cat(`${paper.titlePages + 1}-end`) // cuts away title pages
					.output(`${path.resolve(reviewer.authorDirectory, reviewer.randomReviewName(paper))}.pdf`);

				// console.log(`${PDFTK_PATH} "${paper.filename}" cat 2-end output "${}.pdf"`);
			}).then(() => {
				fs.copyFile(REVIEW_TEMPLATE_PATH, `${path.resolve(reviewer.authorDirectory, reviewer.randomReviewName(paper))}.txt`, (err) => {
					if (err) currentPromise.reject(err);
				});
			});
		});
	});
	return currentPromise.then(papers);
}

function printError(error) {
	console.error(error);
	process.exit(1);
}

switch(process.argv[2]) {
case 'discover':
	Paper.findIn(BASEPATH, NAME_REGEX, FILENAME_CONVENTION)
		.then(assignRandomIdentifiers)
		.then(readTeamsFromFile)
		.then(assignReviewers)
		.then(checks)
		.then(p => writeMappingCSV(p, MAPPING_FILE))
		.then(print)
		.catch(printError);
	break;
case 'distribute':
	readMappingCSV(MAPPING_FILE)
		.then(print)
		.then(writeToDisk)
		.catch(printError);
	break;
case 'collect':
	readMappingCSV(MAPPING_FILE);
	// read CSV
	// resolve reviews
	// collect review files and write to original author dir
	break;
default:
	console.log(`
use these commands:
	- discover: finds all papers, assigns reviewers and writes ${MAPPING_FILE}
	- distribute: writes anonymized files into reviewer's directories
	- collect: combines feedback files into one in the author's directory

example:
	node . discover
	will create mappings.csv
	`);
}
