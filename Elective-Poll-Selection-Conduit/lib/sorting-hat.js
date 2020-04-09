const crypto = require('crypto');

const { PREFERENCE } = require('./Choice');


function assign(options, votersInput) {
	let voters = votersInput.concat([]); // cloning the array

	// this is supposed to work round-robin until all constraints are satisfied.
	let finished = false;
	while (!finished) {
		let voter = voters.shift(); // taking the first one

		let preferredChoice = voter.optionsByPriority.shift();
		if (preferredChoice && assignable(preferredChoice, voter)) {
			console.log(`  + assigning ${voter} to ${preferredChoice.option}`);
			pairUp(preferredChoice.option, voter);
			voters.push(voter); // adding them to the back
		} else if (voter.optionsByPriority.length > 0) {
			console.log(`  - cannot assign ${voter} to ${preferredChoice.option}`);
			voters.unshift(voter); // add them to the front.
		} else {
			console.log(`  o no more choices for ${voter}`);
		}

		finished = checkConstraints(options, voters);
	}
}


function assignable(choice, voter) {
	if (!choice || !voter) {
		console.error(`${choice} /// ${voter}`);
	}
	// is this actually a YES or MAYBE?
	if (choice.preference !== PREFERENCE.YES && choice.preference !== PREFERENCE.MAYBE) {
		return false; // not chosen, not assignable.
	}

	// is this option full?
	// has this voter reached their limit for assigned options?
	// TODO make this per user configurable
	if (voter.assignedOptions.length >= 2) {
		return false;
	}
	return true;
}


function checkConstraints(options, voters) {
	let finished = true;
	for (const voter of voters) {
		if (voter.optionsByPriority.length > 0) {
			finished = false;
		}
	}	

	// TODO should also return _TRUE_ if all options can no longer be assigned voters.

	return finished;
}


function hash(string) {
	var sha256 = crypto.createHash('sha256');
	sha256.update(string);
	return sha256.digest('hex');
}


function pairUp(option, voter) {
	option.assignedVoters.push(voter);
	voter.assignedOptions.push(option);
}


function predictableRandomizer(voters, seedvalue) {
	const randomizedVoters = voters.concat([]); // easy way to duplicate the array
	for (const voter of randomizedVoters) {
		voter.hash = hash(voter.userid + seedvalue);
	}
	randomizedVoters.sort((a, b) => a.hash.localeCompare(b.hash));
	return randomizedVoters;	
}


module.exports = {
	assign,
	hash,
	predictableRandomizer
};
