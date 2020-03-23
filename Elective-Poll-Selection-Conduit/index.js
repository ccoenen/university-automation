const fs = require('fs');

const reader = require('./lib/reader');
const calculator = require('./lib/calculator');

const filename = process.argv[2];
console.log(`Reading file ${filename}`);
const data = reader.parse(fs.readFileSync(filename, 'UTF-8'));
reader.resolveOptionNames(data);
console.log(`${data.options.length} options found / ${data.voters.length} voters found`);

calculator.countOptionPopularity(data.voters);

// print sorted by descending popularity
data.options.sort((a, b) => b.popularity-a.popularity);
data.options.forEach((o) => {
	console.log(o);
});

data.voters.forEach((v) => {
	console.log(`- ${v.toString()}`);
});
