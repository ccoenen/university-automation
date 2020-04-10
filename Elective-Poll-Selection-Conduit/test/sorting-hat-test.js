const assert = require('assert');

const { Choice } = require('../lib/Choice');
const { Option } = require('../lib/Option');
const { Voter } = require('../lib/Voter');
const calculator = require('../lib/calculator');

const sortingHat = require('../lib/sorting-hat');

describe('sorting-hat', () => {
	describe('#hash', () => {
		it('does not crash and burn', () => {
			assert.doesNotThrow(() => {
				sortingHat.hash('test');
			});
		});
		it('creates expected hash', () => {
			assert.strictEqual(sortingHat.hash('bla'), '4df3c3f68fcc83b27e9d42c90431a72499f17875c81a599b566c9889b9696703');
		});
	});

	describe('#predictableRandomizer', () => {
		it('returns some list', () => {
			const result = sortingHat.predictableRandomizer([], 'test');
			assert(result instanceof Array);
		});

		it('randomizes the order based on an input string', () => {
			const voters = [
				new Voter('Alice'),
				new Voter('Bob'),
				new Voter('Carol'),
				new Voter('Dan')
			];

			const expected1 = [voters[0], voters[2], voters[3], voters[1]];
			const result1 = sortingHat.predictableRandomizer(voters, 'test');
			assert.deepStrictEqual(result1, expected1);

			const expected2 = [voters[3], voters[2], voters[0], voters[1]];
			const result2 = sortingHat.predictableRandomizer(voters, 'othertest');
			assert.deepStrictEqual(result2, expected2);
		});
	});

	describe('#assign', () => {
		it('counts assignments', () => {
			const optionA = new Option('test-A');
			const optionB = new Option('test-B');
			const voter1 = new Voter('Bernd', [ new Choice(optionA, 'yes'), new Choice(optionB, 'maybe') ]);
			const voter2 = new Voter('Bernd', [ new Choice(optionA, 'yes') ]);

			const options = [ optionA, optionB ];
			const voters = [ voter1, voter2 ];
			calculator.countOptionPopularity(voters);
			calculator.prepareChoicesByPriority(voters);

			sortingHat.assign(options, voters);

			assert.strictEqual(optionA.assignedVoters.length, 2);
			assert.strictEqual(optionB.assignedVoters.length, 1);
			assert.strictEqual(voter1.assignedOptions.length, 2);
			assert.strictEqual(voter2.assignedOptions.length, 1);
		});

		it('does not assign no or undefined choices', () => {
			const optionA = new Option('test-A');
			const optionB = new Option('test-B');
			const voter1 = new Voter('Bernd1', [ new Choice(optionA, 'no'), new Choice(optionB, 'undefined') ]);
			const voter2 = new Voter('Bernd2', [ new Choice(optionA, 'undeined') ]);

			const options = [ optionA, optionB ];
			const voters = [ voter1, voter2 ];
			calculator.countOptionPopularity(voters);
			calculator.prepareChoicesByPriority(voters);

			sortingHat.assign(options, voters);

			assert.strictEqual(optionA.assignedVoters.length, 0);
			assert.strictEqual(optionB.assignedVoters.length, 0);
			assert.strictEqual(voter1.assignedOptions.length, 0);
			assert.strictEqual(voter2.assignedOptions.length, 0);
		});

		it('stops assigning at the specified maximums for option', () => {
			const optionA = new Option('test-A');
			optionA.maximumAssignableVoters = 1;
			const voter1 = new Voter('Bernd1', [ new Choice(optionA, 'yes') ]);
			const voter2 = new Voter('Bernd2', [ new Choice(optionA, 'yes') ]);

			const options = [ optionA ];
			const voters = [ voter1, voter2 ];
			calculator.countOptionPopularity(voters);
			calculator.prepareChoicesByPriority(voters);

			sortingHat.assign(options, voters);

			assert.strictEqual(optionA.assignedVoters.length, 1);
			assert.strictEqual(voter1.assignedOptions.length, 1);
			assert.strictEqual(voter2.assignedOptions.length, 0);
		});

		it('stops assigning at the specified maximums for voter', () => {
			const optionA = new Option('test-A');
			const optionB = new Option('test-B');
			const optionC = new Option('test-C');
			const optionD = new Option('test-D');
			const optionE = new Option('test-E');
			const voter1 = new Voter('Bernd1', [
				new Choice(optionA, 'maybe'),
				new Choice(optionB, 'undefined'),
				new Choice(optionC, 'yes'),
				new Choice(optionD, 'maybe'),
				new Choice(optionE, 'yes'),
			]);
			voter1.maximumAssignableOptions = 2;

			const options = [ optionA, optionB, optionC, optionD, optionE ];
			const voters = [ voter1 ];
			calculator.countOptionPopularity(voters);
			calculator.prepareChoicesByPriority(voters);

			sortingHat.assign(options, voters);

			assert.strictEqual(optionA.assignedVoters.length, 0);
			assert.strictEqual(optionB.assignedVoters.length, 0);
			assert.strictEqual(optionC.assignedVoters.length, 1);
			assert.strictEqual(optionD.assignedVoters.length, 0);
			assert.strictEqual(optionE.assignedVoters.length, 1);
			assert.strictEqual(voter1.assignedOptions.length, 2);
		});
	});
});
