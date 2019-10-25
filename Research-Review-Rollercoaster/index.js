const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const Paper = require('./Paper');

const BASEPATH = 'this will be changed.';
const NAME_REGEX = /^some basename (.+)$/;
const FILENAME_CONVENTION = /^\w{1,2}\d_\d{6}_(.+)_(.+)\.(.+)/;
const SALT = 'ohai, this will be changed for the actual run. For sure.';

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
				return new Paper(author, path.resolve(basepath,input,files[0]));
			});
			resolve(names);
		});
	});
}

function assignRandomIdentifiers(papers) {
	papers.forEach((paper) => {
		const hash = crypto.createHash('sha256');
		hash.update(paper.author + SALT);
		paper.randomIdentifier = hash.digest('hex').substr(0,6);
	});
	return papers;
}

findAllPapers(BASEPATH)
	.then(assignRandomIdentifiers)
	.then(console.log)
	.catch(console.error);
