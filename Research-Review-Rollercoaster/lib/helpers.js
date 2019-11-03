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
					console.debug(`converting ${paper.filename} to ${reviewer.randomReviewName(paper)}`);
					return pdftk
						.input(paper.filename)
						.cat(`${paper.titlePages + 1}-end`) // cuts away title pages
						.output(`${path.resolve(reviewer.authorDirectory, reviewer.randomReviewName(paper))}.pdf`);

				}).then(() => {
					fs.copyFile(reviewTemplatePath, `${path.resolve(reviewer.authorDirectory, reviewer.randomReviewName(paper))}.txt`, (err) => {
						if (err) currentPromise.reject(err);
					});
				});
			});
		});
		return currentPromise.then(papers);
	}
};
