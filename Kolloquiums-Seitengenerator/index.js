const fs = require('fs');

const mustache = require('mustache');
const parse = require('csv-parse')
const transform = require('stream-transform');

const template = fs.readFileSync('./template.mustache').toString();
const parser = parse();
const input = fs.createReadStream('./input.csv');

const transformer = transform(function(record, callback){
	callback(null, mustache.render(template, {
		time: record[1],
		teamNumber: record[4],
		teamName: "xxx",
//		people: record[5].split(", ") // first column of names
		people: record[7].split(", ") // second column of names
	}));
}, {parallel: 10});

input.pipe(parser).pipe(transformer).pipe(process.stdout);
