const fs = require('fs');

const reader = require('./lib/reader');
const calculator = require('./lib/calculator');
const sortingHat = require('./lib/sorting-hat');
const happyHistogram = require('./lib/happy-histogram');

const filename = process.argv[2];
console.log(`Reading file ${filename}`);
const data = reader.parseHTML(fs.readFileSync(filename, 'UTF-8'));
console.log(`${data.options.length} options found / ${data.voters.length} voters found`);

console.log('\n\n# Skiplist');
const skiplist = require('./skiplist');
data.voters = data.voters.filter(element => !skiplist.includes(element.name));

console.log('\n\n# Userid report');
reader.setMissingUserIds(data.voters, require('./missingUserIds'));
data.voters.forEach(v => { v.maximumAssignableOptions = 2; });
reader.applyOptionMaximumPerVoter(data.voters, require('./optionsPerVoter'));
reader.applyVoterMaximumPerOption(data.options, require('./votersPerOption'));
reader.resolveOptionNames(data);

calculator.countOptionPopularity(data.voters);
calculator.prepareChoicesByPriority(data.voters);

console.log('\n\n# Weighted Popularity');
data.options.sort((a, b) => b.popularity - a.popularity);
data.options.forEach((o) => {
	console.log(`* ${o.name} (${o.popularity}/${o.maximumAssignableVoters} - ${(o.popularity/o.maximumAssignableVoters).toFixed(1)}x)`);
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
randomizedList.sort((a, b) => a.userid.localeCompare(b.userid));
randomizedList.forEach((v) => {
	console.log(`- ${v.userid}: ${v.assignedOptions.map(o=>o.name).join(', ')} happiness: ${v.getHappiness()}%`);
});

console.log('\n\n# Course Summary');
data.options.forEach((o) => {
	console.log(`${o.name}: ${o.assignedVoters.length} people (${Math.round(100*o.assignedVoters.length/o.maximumAssignableVoters)}%)`);
});

console.log('\n\n# Happiness Histogram');
for (let [label, value] of Object.entries(happyHistogram.histogram(data.voters))) {
	console.log(`* ${label}: ${value} \t${new Array(value + 1).join('*')}`);
}
