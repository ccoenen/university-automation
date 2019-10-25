const fs = require('fs');
const path = require('path');

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

function findAllPapers(basepath) {
	return new Promise((resolve, reject) => {
		fs.readdir(basepath, (err, result) => {
			if (err) return reject(err);
			const names = result.map((input) => {
				const author = input.match(NAME_REGEX)[1];
				const files = fs.readdirSync(path.resolve(basepath,input));
				if (files.length !== 1) {
					return reject(`not exactly one file in ${input}, instead found ${files}.`);
				} else if (!FILENAME_CONVENTION.test(files[0])) {
					console.warn(`${input}/${files[0]} does not conform to naming standards.`);
				}
				return new Paper(author, path.resolve(basepath, input), path.resolve(basepath, input, files[0]));
			});
			resolve(names);
		});
	});
}

function assignRandomIdentifiers(papers) {
	papers.forEach(paper => paper.setRandomIdentifier());
	return papers;
}

function readTeamsFromFile(papers) {
	return new Promise((resolve, reject) =>  {
		
		var fileStream = fs.createReadStream(TEAM_FILE);

		var csvStream = csv({headers: true, trim: true, comment: '#'})
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
					console.error(`no solution for ${paper} because\n${rejectionReasons.map(r => `- ${r}`).join('\n')}`);
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
		console.log(paper.allReviewedBy());
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
		if (p.reviewing.length !== 3) console.warn(`${p.author} is not supposed to review ${p.reviewing}`);
		if (p.reviewedBy.length !== 3) console.warn(`${p.author} is not supposed to be reviewed by ${p.reviewedBy.length} people`);
	});
	return papers;
}

function print(papers) {
	papers.forEach(paper => console.log(paper.allReviewedBy()));
	return papers;
}

function writeToDisk(papers) {
	let currentPromise = Promise.resolve();
	papers.forEach(paper => {
		paper.reviewedBy.forEach(reviewer => {
			currentPromise = currentPromise.then(() => { // current = current.then chains it!
				console.debug(`converting ${paper.filename} to ${reviewer.randomReviewName(paper)}`);
				return pdftk
					.input(paper.filename)
					.cat('2-end')
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

findAllPapers(BASEPATH)
	.then(assignRandomIdentifiers)
	.then(readTeamsFromFile)
	.then(assignReviewers)
	.then(checks)
	.then(print)
	.then(writeToDisk)
	.catch(console.error);
