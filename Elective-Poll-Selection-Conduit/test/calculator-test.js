const assert = require('assert');

const { Choice, PREFERENCE } = require('../lib/Choice');
const { Option } = require('../lib/Option');
const { Voter } = require('../lib/Voter');

const calculator = require('../lib/calculator');

describe('calculator', function() {
	describe('#countOptionPopularity', () => {
		let options;
		beforeEach(() => {
			options = [
				new Option('A'),
				new Option('B'),
				new Option('C'),
				new Option('D'),
			];
		});


		it('counts the correct popularity', () => {
			const voters = [
				new Voter('Bernd', [
					new Choice(options[0], PREFERENCE.YES),
					new Choice(options[1], PREFERENCE.MAYBE),
					new Choice(options[2], PREFERENCE.NO),
					new Choice(options[3], PREFERENCE.UNDEFINED)
				])
			];

			calculator.countOptionPopularity(voters);
			calculator.countOptionPopularity(voters); // does not count twice!
			calculator.countOptionPopularity(voters); // or three times.
			assert.strictEqual(options[0].popularity, 1);
			assert.strictEqual(options[1].popularity, 0.5);
			assert.strictEqual(options[2].popularity, 0);
			assert.strictEqual(options[3].popularity, 0);
		});
	});


	describe('#prepareOptionsByPriority', () => {
		let options;
		let voters;


		beforeEach(() => {
			options = [
				new Option('A'),
				new Option('B'),
				new Option('C'),
				new Option('D'),
			];

			voters = [
				new Voter('Alice', [
					new Choice(options[0], 'maybe'),
					new Choice(options[1], 'no'),
					new Choice(options[2], 'yes'),
					new Choice(options[3], 'yes')
				]),
				new Voter('Bob', [
					new Choice(options[0], 'maybe'),
					new Choice(options[1], 'maybe'),
					new Choice(options[2], 'no'),
					new Choice(options[3], 'undefined')
				])
			];
		});


		it('prepares the options sorted by priority', () => {
			calculator.countOptionPopularity(voters);
			calculator.prepareOptionsByPriority(voters);

			const prioritizedLists = [
				[
					new Choice(options[2], 'yes'),
					new Choice(options[3], 'yes'),
					new Choice(options[0], 'maybe'),
					new Choice(options[1], 'no'),
				], [
					new Choice(options[1], 'maybe'),
					new Choice(options[0], 'maybe'), // this is lower because more people voted for it!
					new Choice(options[3], 'undefined'),
					new Choice(options[2], 'no')
				]
			];

			assert.deepStrictEqual(voters[0].optionsByPriority, prioritizedLists[0]);
			assert.deepStrictEqual(voters[1].optionsByPriority, prioritizedLists[1]);
		});
	});
});
