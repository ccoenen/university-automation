const fs = require('fs');

const csv = require('fast-csv');

const Paper = require('./Paper');

module.exports = {
	write: function (papers, file) {
		return new Promise((resolve, reject) =>  {
			const filestream = fs.createWriteStream(file, {flags: 'wx', encoding: 'UTF-8'});
			filestream.on('error', err => {
				reject(`${file} could not be opened for writing. ${err}`);
			});

			const stream = csv.format({
				headers: true
			});

			stream.pipe(filestream);
			papers.forEach((paper) => {
				stream.write(paper.toCSV());
			});
			stream.end();

			return papers;
		});
	},

	read: function (file) {
		return new Promise((resolve, reject) =>  {
			const fileStream = fs.createReadStream(file, {encoding: 'UTF-8'});
			const papers = [];

			const csvStream = csv({headers: true, trim: true, comment: '#'})
				.on('data', (data) => {
					papers.push(Paper.fromCSV(data));
				})

				.on('end', () => {
					resolve(papers);
				})

				.on('error', (err) => {
					return reject(`Failed to parse ${file}: ${err.message}`);
				});
			fileStream.pipe(csvStream);
		}).then(resolveReviewer);
	}
};

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
