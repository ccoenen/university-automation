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

	});
});
