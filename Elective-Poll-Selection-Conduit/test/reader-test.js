const assert = require('assert');
const fs = require('fs');

const { Choice } = require('../lib/Choice');
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


	describe('#parse', () => {
		it('has a test string in place', () => {
			assert.notStrictEqual(htmlString, '');
		});

		it('does not fail for a working string', () => {
			assert.doesNotThrow(() => {
				reader.parse(htmlString);
			});
		});


		it('fails for an incompabtible string', () => {
			assert.throws(() => {
				reader.parse(bogusString);
			});
		});


		it('extracts the correct options (courses)', () => {
			const expected = [
				'Kurs A (Dozent A)',
				'Kurs B (Dozent B)',
				'Kurs C (Dozent C)',
				'Kurs D (Dozent D)',
				'Kurs E (Dozent E)',
				'Kurs F (Dozent F)',
				'Kurs G (Dozent G)',
				'Kurs H (Dozent H)',
				'Kurs I (Dozent I)',
				'Kurs J (Dozent J)'
			];

			assert.deepStrictEqual(reader.parse(htmlString).options, expected);
		});


		it('extracts the correct voters (students)', () => {
			const expected = [
				new Voter('Test-User-C', [new Choice('', 'yes'), new Choice('', 'maybe'), new Choice('', 'undefined'), new Choice('', 'yes'), new Choice('', 'undefined'), new Choice('', 'undefined'), new Choice('', 'undefined'), new Choice('', 'yes'), new Choice('', 'maybe'), new Choice('', 'undefined')]),
				new Voter('Test-User-A', [new Choice('', 'no'), new Choice('', 'no'), new Choice('', 'no'), new Choice('', 'no'), new Choice('', 'no'), new Choice('', 'yes'), new Choice('', 'no'), new Choice('', 'no'), new Choice('', 'no'), new Choice('', 'no')]),
				new Voter('example.one@example.com', [new Choice('', 'undefined'), new Choice('', 'yes'), new Choice('', 'undefined'), new Choice('', 'undefined'), new Choice('', 'maybe'), new Choice('', 'undefined'), new Choice('', 'yes'), new Choice('', 'undefined'), new Choice('', 'undefined'), new Choice('', 'undefined')]),
				new Voter('example.allmoi@example.com', [new Choice('', 'yes'), new Choice('', 'yes'), new Choice('', 'yes'), new Choice('', 'yes'), new Choice('', 'yes'), new Choice('', 'yes'), new Choice('', 'yes'), new Choice('', 'yes'), new Choice('', 'yes'), new Choice('', 'yes')])
			];

			expected[1].userid = 'test.user.a';

			assert.deepStrictEqual(reader.parse(htmlString).voters, expected);
		});
	});


	describe('#resolveOptionNames', () => {
		it('assigns the correct option names to the choices', () => {
			const parsedData = reader.parse(htmlString);
			const expected = new Voter('Test-User-A', [
				new Choice('Kurs A (Dozent A)', 'no'),
				new Choice('Kurs B (Dozent B)', 'no'),
				new Choice('Kurs C (Dozent C)', 'no'),
				new Choice('Kurs D (Dozent D)', 'no'),
				new Choice('Kurs E (Dozent E)', 'no'),
				new Choice('Kurs F (Dozent F)', 'yes'),
				new Choice('Kurs G (Dozent G)', 'no'),
				new Choice('Kurs H (Dozent H)', 'no'),
				new Choice('Kurs I (Dozent I)', 'no'),
				new Choice('Kurs J (Dozent J)', 'no')
			]);
			expected.userid = 'test.user.a';
			reader.resolveOptionNames(parsedData);

			assert.deepStrictEqual(parsedData.voters[1], expected);
		});
	});
});
