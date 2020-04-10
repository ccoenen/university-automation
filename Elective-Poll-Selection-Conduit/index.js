const fs = require('fs');

const reader = require('./lib/reader');
const calculator = require('./lib/calculator');
const sortingHat = require('./lib/sorting-hat');

const filename = process.argv[2];
console.log(`Reading file ${filename}`);
const data = reader.parseHTML(fs.readFileSync(filename, 'UTF-8'));
console.log(`${data.options.length} options found / ${data.voters.length} voters found`);

reader.applyVoterMaximumPerOption(data.options, require('./votersPerOption'));
reader.resolveOptionNames(data);

calculator.countOptionPopularity(data.voters);
calculator.prepareChoicesByPriority(data.voters);

console.log('\n\n# Popularity');
data.options.sort((a, b) => b.popularity - a.popularity);
data.options.forEach((o) => {
	console.log(`* ${o.name} (${o.popularity}/${o.maximumAssignableVoters})`);
});

/*
// Nobody cares. Interesting for debugging, though.
console.log('\n\n# Voters including Choices');
data.voters.forEach((v) => {
	console.log(`- ${v.toString()}`);
});
*/

console.log('\n\n# Assigned choices');
const randomizedList = sortingHat.predictableRandomizer(data.voters, '1');
sortingHat.assign(data.options, randomizedList);
randomizedList.forEach((v) => {
	console.log(`- ${v.userid}: ${v.assignedOptions.map(o=>o.name).join(', ')} happiness: ${Math.round(v.happiness/v.maximumAssignableOptions*100)}%`);
});

console.log('\n\n# Course Summary');
data.options.forEach((o) => {
	console.log(`${o.name}: ${o.assignedVoters.length} people`);
});
