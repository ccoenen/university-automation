const assert = require('assert');

const { Choice } = require('../lib/Choice');
const { Voter } = require('../lib/Voter');


describe('Voter', function() {
	describe('#prepareOptionsByPriority', () => {
		let voter;


		beforeEach(() => {
			voter = new Voter('test', [
				new Choice('A', 'maybe'),
				new Choice('B', 'no'),
				new Choice('C', 'yes')
			]);
		});


		it('prepares the options sorted by priority', () => {
			const expected = [
				new Choice('C', 'yes'),
				new Choice('A', 'maybe'),
				new Choice('B', 'no')
			];
			voter.prepareOptionsByPriority();
			assert.deepStrictEqual(voter.optionsByPriority, expected);
		});
	});
});
