const fs = require('fs');

const reader = require('./lib/reader');
const calculator = require('./lib/calculator');
const sortingHat = require('./lib/sorting-hat');
const happyHistogram = require('./lib/happy-histogram');

let data;

function setup(filename, print = false) {
	print && console.log(`Reading file ${filename}`);
	data = reader.parseHTML(fs.readFileSync(filename, 'UTF-8'));
	print && console.log(`${data.options.length} options found / ${data.voters.length} voters found`);
	
	print && console.log('\n\n# Skiplist');
	const skiplist = require('./skiplist');
	data.voters = data.voters.filter(element => !skiplist.includes(element.name));
	
	print && console.log('\n\n# Userid report');
	reader.setMissingUserIds(data.voters, require('./missingUserIds'));
	data.voters.forEach(v => { v.maximumAssignableOptions = 2; });
	reader.applyOptionMaximumPerVoter(data.voters, require('./optionsPerVoter'));
	reader.applyVoterMaximumPerOption(data.options, require('./votersPerOption'));
	reader.resolveOptionNames(data);
	
	calculator.countOptionPopularity(data.voters);
	
	print && console.log('\n\n# Weighted Popularity');
	data.options.sort((a, b) => b.popularity - a.popularity);
	data.options.forEach((o) => {
		print && console.log(`* ${o.name} (${o.popularity}/${o.maximumAssignableVoters} - ${(o.popularity/o.maximumAssignableVoters).toFixed(1)}x)`);
	});

	/*
	// Nobody cares. Interesting for debugging, though.
	console.log('\n\n# Voters including Choices');
	data.voters.forEach((v) => {
		console.log(`- ${v.toString()}`);
	});
	*/
}


function singleRun(seedValue, print = false) {
	data.voters.forEach(v => { v.assignedOptions = []; v.happiness = 0; });
	data.options.forEach(o => o.assignedVoters = []);
	calculator.prepareChoicesByPriority(data.voters);

	const randomizedList = sortingHat.predictableRandomizer(data.voters, seedValue);
	sortingHat.assign(data.options, randomizedList);
	const overallHappiness = data.voters.reduce((a, voter) => a + voter.getHappiness(), 0) / data.voters.length;

	if (print) {
		console.log('\n\n# Assigned choices');
		randomizedList.sort((a, b) => a.userid.localeCompare(b.userid));
		randomizedList.forEach((v) => {
			console.log(`- ${v.userid}: ${v.assignedOptions.map(o=>o.name).join(', ')} happiness: ${v.getHappiness()}%`);
		});

		console.log('\n\n# Course Summary');
		data.options.forEach((o) => {
			console.log(`${o.name}: ${o.assignedVoters.length} people (${Math.round(100*o.assignedVoters.length/o.maximumAssignableVoters)}%)`);
		});

		console.log('\n\n# Course Lists');
		data.options.forEach((o) => {
			console.log(`\n## ${o.name}`);
			o.assignedVoters.sort((a, b) => a.userid.localeCompare(b.userid)).forEach((v) => {
				console.log(`${v.name}, ${v.userid}`);
			});
		});

		console.log('\n\n# Happiness Histogram');
		for (let [label, value] of Object.entries(happyHistogram.histogram(data.voters))) {
			console.log(`* ${label}: ${value} \t${new Array(value + 1).join('*')}`);
		}
		console.log(`total demand for ${data.voters.reduce((a, v) => a + v.maximumAssignableOptions, 0)} options`);
		console.log(`${data.voters.reduce((a, v) => a + v.assignedOptions.length, 0)} options assigned`);
		console.log(`${data.voters.filter(v => v.assignedOptions.length < v.maximumAssignableOptions).length} voters did not get their maximum number of options`);
		console.log(`${data.options.reduce((a, o) => a + o.maximumAssignableVoters - o.assignedVoters.length, 0)} assignable places left`);

		console.log('\n\n# Overall Happiness');
		console.log(`${overallHappiness.toFixed(2)}%`);
	}

	return overallHappiness;
}

const filename = process.argv[2];
const runs = parseInt(process.argv[3], 10) || 1;
setup(filename, true);

const BATCHSIZE = 2500;
let optimum = 0;
let worst = Infinity;
let optimumSeed;
let keepRunning = true;
process.once('SIGINT', () => {
	console.log('# SIGINT received');
	keepRunning = false;
});

function seedRunner(start=0) {
	const preliminaryEnd = Math.min(start + BATCHSIZE, runs);
	process.stdout.write(`seeds ${start} of ${runs} (${(100*start/runs).toFixed(2)}%)\r`);
	for (let seed = start; seed < preliminaryEnd; seed++) {
		const result = singleRun(seed);
		if (result > optimum) {
			console.log(`new optimum found at seed ${seed}: ${result} (found at ${(new Date()).toISOString()})`);
			optimum = result;
			optimumSeed = seed;
		}
		if (result < worst) {
			worst = result;
			console.log(`new worst case found at seed ${seed}: ${result} (found at ${(new Date()).toISOString()})`);
		}
	}

	if (!keepRunning || start >= runs) {
		console.log(`stopping at ${preliminaryEnd}`);
		singleRun(optimumSeed, true);
	} else {
		setImmediate(() => seedRunner(preliminaryEnd));
	}
}

seedRunner();
