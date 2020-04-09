const fs = require('fs');

const reader = require('./lib/reader');
const calculator = require('./lib/calculator');
const sortingHat = require('./lib/sorting-hat');

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

console.log('# Voters');
data.voters.forEach((v) => {
	console.log(`- ${v.toString()}`);
});

console.log('\n\n# chosen choices');
const randomizedList = sortingHat.predictableRandomizer(data.voters, '1');
sortingHat.assign(data.options, randomizedList);
randomizedList.forEach((v) => {
	console.log(`- ${v.userid}: ${v.assignedOptions.map(o=>o.option.name).join(', ')}`);
});
