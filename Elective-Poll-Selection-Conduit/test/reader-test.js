const assert = require('assert');
const fs = require('fs');

const { Choice } = require('../lib/Choice');
const { Option } = require('../lib/Option');
const { Voter } = require('../lib/Voter');

const reader = require('../lib/reader');

describe('reader', function() {
	let htmlString = '';
	let bogusString = 'aiudfoyicuvym';


	before((done) => {
		fs.readFile('./test/fixtures/sample-table.html', (err, data) => {
			if (err) throw err;
			htmlString = data.toString();
			done();
		});
	});


	describe('#parseHTML', () => {
		it('has a test string in place', () => {
			assert.notStrictEqual(htmlString, '');
		});

		it('does not fail for a working string', () => {
			assert.doesNotThrow(() => {
				reader.parseHTML(htmlString);
			});
		});


		it('fails for an incompabtible string', () => {
			assert.throws(() => {
				reader.parseHTML(bogusString);
			});
		});


		it('extracts the correct options (courses)', () => {
			const expected = [
				new Option('Kurs A (Dozent A)'),
				new Option('Kurs B (Dozent B)'),
				new Option('Kurs C (Dozent C)'),
				new Option('Kurs D (Dozent D)'),
				new Option('Kurs E (Dozent E)'),
				new Option('Kurs F (Dozent F)'),
				new Option('Kurs G (Dozent G)'),
				new Option('Kurs H (Dozent H)'),
				new Option('Kurs I (Dozent I)'),
				new Option('Kurs J (Dozent J)')
			];

			assert.deepStrictEqual(reader.parseHTML(htmlString).options, expected);
		});


		it('extracts the correct voters (students)', () => {
			const expected = [];
			expected[0] = new Voter('Test-User-C', [
				new Choice(undefined, 'yes'),
				new Choice(undefined, 'maybe'),
				new Choice(undefined, 'undefined'),
				new Choice(undefined, 'yes'),
				new Choice(undefined, 'undefined'),
				new Choice(undefined, 'undefined'),
				new Choice(undefined, 'undefined'),
				new Choice(undefined, 'yes'),
				new Choice(undefined, 'maybe'),
				new Choice(undefined, 'undefined')
			]);
			expected[1] = new Voter('Test-User-A', [
				new Choice(undefined, 'no'),
				new Choice(undefined, 'no'),
				new Choice(undefined, 'no'),
				new Choice(undefined, 'no'),
				new Choice(undefined, 'no'),
				new Choice(undefined, 'yes'),
				new Choice(undefined, 'no'),
				new Choice(undefined, 'no'),
				new Choice(undefined, 'no'),
				new Choice(undefined, 'no')
			]);
			expected[2] = new Voter('example.one@example.com', [
				new Choice(undefined, 'undefined'),
				new Choice(undefined, 'yes'),
				new Choice(undefined, 'undefined'),
				new Choice(undefined, 'undefined'),
				new Choice(undefined, 'maybe'),
				new Choice(undefined, 'undefined'),
				new Choice(undefined, 'yes'),
				new Choice(undefined, 'undefined'),
				new Choice(undefined, 'undefined'),
				new Choice(undefined, 'undefined')
			]);
			expected[3] = new Voter('example.allmoi@example.com', [
				new Choice(undefined, 'yes'),
				new Choice(undefined, 'yes'),
				new Choice(undefined, 'yes'),
				new Choice(undefined, 'yes'),
				new Choice(undefined, 'yes'),
				new Choice(undefined, 'yes'),
				new Choice(undefined, 'yes'),
				new Choice(undefined, 'yes'),
				new Choice(undefined, 'yes'),
				new Choice(undefined, 'yes')
			]);

			expected[1].userid = 'test.user.a';

			assert.deepStrictEqual(reader.parseHTML(htmlString).voters, expected);
		});
	});


	describe('#resolveOptionNames', () => {
		it('assigns the correct option names to the choices', () => {
			const parsedData = reader.parseHTML(htmlString);
			const expected = new Voter('Test-User-A', [
				new Choice(new Option('Kurs A (Dozent A)'), 'no'),
				new Choice(new Option('Kurs B (Dozent B)'), 'no'),
				new Choice(new Option('Kurs C (Dozent C)'), 'no'),
				new Choice(new Option('Kurs D (Dozent D)'), 'no'),
				new Choice(new Option('Kurs E (Dozent E)'), 'no'),
				new Choice(new Option('Kurs F (Dozent F)'), 'yes'),
				new Choice(new Option('Kurs G (Dozent G)'), 'no'),
				new Choice(new Option('Kurs H (Dozent H)'), 'no'),
				new Choice(new Option('Kurs I (Dozent I)'), 'no'),
				new Choice(new Option('Kurs J (Dozent J)'), 'no')
			]);

			expected.userid = 'test.user.a';
			reader.resolveOptionNames(parsedData);

			assert.deepStrictEqual(parsedData.voters[1], expected);
		});
	});
});
