const pdftk = require('node-pdftk');

const Paper = require('./Paper');
const mappingCSV = require('./lib/mapping-csv');
const {prettyPrintPapers, printError, writeReviewFiles} = require('./lib/helpers');
const reviewers = require('./lib/reviewers');
const teams = require('./lib/teams');

let CONFIG;
try {
	CONFIG = require('./config');
} catch (e) {
	console.error('could not open config file, did you copy yours from the config.js.example?');
	printError(e);
}

if (CONFIG.PDFTK_PATH) {
	pdftk.configure({bin: CONFIG.PDFTK_PATH});
}

function assignRandomIdentifiers(papers) {
	papers.forEach(paper => paper.setRandomIdentifier(CONFIG.RANDOM_IDENTIFIER_SALT));
	return papers;
}


switch(process.argv[2]) {
case 'discover':
	Paper.findIn(CONFIG.PAPER_CONTAINER, CONFIG.NAME_REGEX, CONFIG.FILENAME_CONVENTION)
		.then(assignRandomIdentifiers)
		.then(papers => teams.fromFile(papers, CONFIG))
		.then(reviewers.assign)
		.then(reviewers.check)
		.then(papers => mappingCSV.write(papers, CONFIG.MAPPING_FILE))
		.then(prettyPrintPapers)
		.catch(printError);
	break;

case 'prepare-reviews':
	mappingCSV.read(CONFIG.MAPPING_FILE)
		.then(reviewers.check)
		.then(prettyPrintPapers)
		.then(papers => writeReviewFiles(papers, CONFIG.REVIEW_TEMPLATE_PATH))
		.catch(printError);
	break;

case 'collect-reviews':
	mappingCSV.read(CONFIG.MAPPING_FILE)
		.then(reviewers.check)
		.then(prettyPrintPapers)
		.catch(printError);
	break;

default:
	console.log(`
use these commands:
	- discover: finds all papers, assigns reviewers and writes ${CONFIG.MAPPING_FILE}
	- prepare-reviews: writes anonymized files into reviewer's directories
	- collect-reviews: collects the reviews above back into the authors directories
	- prepare-supervision: writes anonymized files into reviewer's directories
	- collect-supervision: writes anonymized files into reviewer's directories
	- collect: combines feedback files into one in the author's directory

example:
	node . discover
	will create mappings.csv
	`);
}
