const fs = require('fs').promises;
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

	removeTitlePage: function (paper, target) {
		console.debug(`converting ${paper.filename} to ${target}`);
		return pdftk
			.input(paper.filename)
			.cat(`${paper.titlePages + 1}-end`) // cuts away title pages
			.output(target);
	},

	writeReviewFiles: function (papers, reviewTemplatePath) {
		let currentPromise = Promise.resolve();
		papers.forEach(paper => {
			paper.reviewedBy.forEach(reviewer => {
				currentPromise = currentPromise.then(() => { // current = current.then chains it!
					return module.exports.removeTitlePage(paper, module.exports.reviewPath(paper, reviewer, '.pdf'));
				}).then(() => {
					return fs.copyFile(reviewTemplatePath, module.exports.reviewPath(paper, reviewer, '.txt'));
				});
			});
		});
		return currentPromise.then(papers);
	},

	reviewPath: function (paper, reviewer, suffix) {
		const basename = `review-${paper.randomIdentifier}-${reviewer.randomIdentifier}`;
		const fullPath = `${path.resolve(reviewer.authorDirectory, basename)}${suffix}`;
		return fullPath;
	}
};
