const fs = require('fs');
const path = require('path');

const Paper = require('./Paper');

const BASEPATH = 'this will be changed.';
const NAME_REGEX = /^some basename (.+)$/;
const FILENAME_CONVENTION = /^\w{1,2}\d_\d{6}_(.+)_(.+)\.(.+)/;
const PDFTK_PATH = 'C:/Tools/PDFtk/bin/pdftk.exe';
const REVIEW_TEMPLATE_PATH = 'somewhere/review-template.txt';

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

function assignReviewers(papers) {
	let reviewers = [];
	papers.forEach((paper) => {
		if (reviewers.length === 0) reviewers = [].concat(papers); // cloning the array
		let randomReviewer;
		while (paper.reviewedBy.length < 3 && reviewers.length > 0) {
			randomReviewer = reviewers.pop();
			if (paper.reviewedBy.includes(randomReviewer)) {
				continue; // person already reviewes this one
			} else if (paper.reviewing.includes(randomReviewer)) {
				continue; // person is under review by this papers author. No quid-pro-quos.
			} else if (randomReviewer.reviewing.length >= 3) {
				continue; // this reviewer already has a lot on his plate
			}
			paper.reviewedBy.push(randomReviewer);
			randomReviewer.reviewing.push(paper);
		}
	});
	return papers;
}

function print(papers) {
	papers.forEach(paper => console.log(paper.toString()));
	return papers;
}

function writeToDisk(papers) {
	let currentPromise = Promise.resolve();
	papers.forEach(paper => {
		currentPromise = currentPromise.then(() => { // current = current.then chains it!
			paper.reviewedBy.forEach(reviewer => {
				console.log(`${PDFTK_PATH} "${paper.filename}" cat 2-end output "${path.resolve(reviewer.authorDirectory, reviewer.randomReviewName(paper))}.pdf"`);
				console.log(`cp "${REVIEW_TEMPLATE_PATH}" "${path.resolve(reviewer.authorDirectory, reviewer.randomReviewName(paper))}.txt"`);
			});
		});
	});
	return currentPromise;
}

findAllPapers(BASEPATH)
	.then(assignRandomIdentifiers)
	// .then(readTeamsFromFile) // will be added later
	.then(assignReviewers)
	.then(print)
	.then(writeToDisk)
	.catch(console.error);
