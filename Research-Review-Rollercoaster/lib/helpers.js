const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const pdftk = require('node-pdftk');

module.exports = {
	highlight: chalk.redBright.bgBlack,

	prettyPrintPapers: function (papers) {
		papers.forEach(paper => console.log(paper.allReviewedBy()));
		return papers;
	},

	printError: function (error) {
		console.error(error);
		process.exit(1);
	},

	writeReviewFiles: function (papers, reviewTemplatePath) {
		let currentPromise = Promise.resolve();
		papers.forEach(paper => {
			paper.reviewedBy.forEach(reviewer => {
				currentPromise = currentPromise.then(() => { // current = current.then chains it!
					console.debug(`converting ${paper.filename} to ${module.exports.reviewPath(paper, reviewer, '.pdf')}`);
					return pdftk
						.input(paper.filename)
						.cat(`${paper.titlePages + 1}-end`) // cuts away title pages
						.output(module.exports.reviewPath(paper, reviewer, '.pdf'));

				}).then(() => {
					fs.copyFile(reviewTemplatePath, module.exports.reviewPath(paper, reviewer, '.txt'), (err) => {
						if (err) currentPromise.reject(err);
					});
				});
			});
		});
		return currentPromise.then(papers);
	},

	collectReviewFiles: function (papers, singleTarget) {
		papers.forEach(paper => {
			const target = singleTarget || paper.authorDirectory;
			const reviewCollectionFile = path.resolve(target, `P3_191103_Paper reviews for ${paper.author}.txt`);
			console.log(reviewCollectionFile);
			const reviewCollectionStream = fs.createWriteStream(reviewCollectionFile, {flag: 'w'}); // always overwrite

			const REVIEW_HEADER = `Reviews for ${paper.author}\n===\n\nThese reviews belong to ${path.basename(paper.filename)}.`;
			reviewCollectionStream.write(REVIEW_HEADER);

			paper.reviewedBy.forEach((reviewer, index) => {
				const singleReview = fs.readFileSync(module.exports.reviewPath(paper, reviewer, '.txt'));
				reviewCollectionStream.write(`\n\n***\nReview ${index+1}\n----\n`);
				reviewCollectionStream.write(singleReview);
			});

			reviewCollectionStream.end();
		});
		return papers; // in the end return papers again
	},

	reviewPath: function (paper, reviewer, suffix) {
		const basename = `review-${paper.randomIdentifier}-${reviewer.randomIdentifier}`;
		const fullPath = `${path.resolve(reviewer.authorDirectory, basename)}${suffix}`;
		return fullPath;
	}
};
