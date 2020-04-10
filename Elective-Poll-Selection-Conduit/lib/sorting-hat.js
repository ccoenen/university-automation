const crypto = require('crypto');

const { PREFERENCE } = require('./Choice');

const DEBUG = false;

function assign(options, votersInput) {
	let voters = votersInput.concat([]); // cloning the array

	// this is supposed to work round-robin until all constraints are satisfied.
	let finished = false;
	while (!finished) {
		let voter = voters.shift(); // taking the first one

		DEBUG && console.log(`${voter.userid}, >>${voter.choicesByPriority}<<`);
		let preferredChoice = voter.choicesByPriority.shift();
		if (preferredChoice && assignable(preferredChoice, voter)) {
			DEBUG && console.log(`  + assigning ${voter.userid} to ${preferredChoice.option}`);
			pairUp(preferredChoice, voter);
			voters.push(voter); // adding them to the back
		} else if (voter.choicesByPriority.length > 0) {
			DEBUG && console.log(`  - cannot assign ${voter.userid} to ${preferredChoice.option}`);
			voters.unshift(voter); // add them to the front.
		} else {
			DEBUG && console.log(`  o no more choices for ${voter.userid}`);
		}

		finished = checkConstraints(options, voters);
	}
}


function assignable(choice, voter) {
	if (!choice) {
		throw new Error('no choice provided');
	}
	if (!voter) {
		throw new Error('no voter provided');
	}

	// is this actually a YES or MAYBE?
	if (choice.preference !== PREFERENCE.YES && choice.preference !== PREFERENCE.MAYBE) {
		return false; // not chosen, not assignable.
	}

	// is this option full?
	const option = choice.option;
	if (option.assignedVoters.length >= option.maximumAssignableVoters) {
		return false;
	}

	// has this voter reached their limit for assigned options?
	if (voter.assignedOptions.length >= voter.maximumAssignableOptions) {
		return false;
	}

	// nothing stopping us from assigning this. Continue.
	return true;
}


function checkConstraints(options, voters) {
	let finished = true;
	for (const voter of voters) {
		if (voter.choicesByPriority.length > 0) {
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


function pairUp(choice, voter) {
	choice.option.assignedVoters.push(voter);
	voter.assignedOptions.push(choice.option);
	if (choice.preference === PREFERENCE.YES) {
		voter.happiness += 1;
	} else if (choice.preference === PREFERENCE.MAYBE) {
		voter.happiness += 0.33;
	} else {
		voter.happiness -= 1;
	}
}


function predictableRandomizer(voters, seedvalue) {
	const randomizedVoters = voters.concat([]); // easy way to duplicate the array
	for (const voter of randomizedVoters) {
		voter.hash = hash(voter.name + seedvalue);
	}
	randomizedVoters.sort((a, b) => a.hash.localeCompare(b.hash));
	return randomizedVoters;	
}


module.exports = {
	assign,
	hash,
	_pairUp: pairUp,
	predictableRandomizer
};
