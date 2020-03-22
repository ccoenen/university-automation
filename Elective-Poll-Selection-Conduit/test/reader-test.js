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
			const expected = [];
			expected[0] = new Voter('Test-User-C', [
				new Choice('', 'yes', 1/3),
				new Choice('', 'maybe', 1/2),
				new Choice('', 'undefined', 1/5),
				new Choice('', 'yes', 1/3),
				new Choice('', 'undefined', 1/5),
				new Choice('', 'undefined', 1/5),
				new Choice('', 'undefined', 1/5),
				new Choice('', 'yes', 1/3),
				new Choice('', 'maybe', 1/2),
				new Choice('', 'undefined', 1/5)
			]);
			expected[0].optionsByPriority = [
				new Choice('', 'yes', 1/3),
				new Choice('', 'yes', 1/3),
				new Choice('', 'yes', 1/3),
				new Choice('', 'maybe', 1/2),
				new Choice('', 'maybe', 1/2),
				new Choice('', 'undefined', 1/5),
				new Choice('', 'undefined', 1/5),
				new Choice('', 'undefined', 1/5),
				new Choice('', 'undefined', 1/5),
				new Choice('', 'undefined', 1/5)
			];

			expected[1] = new Voter('Test-User-A', [
				new Choice('', 'no', 1/9),
				new Choice('', 'no', 1/9),
				new Choice('', 'no', 1/9),
				new Choice('', 'no', 1/9),
				new Choice('', 'no', 1/9),
				new Choice('', 'yes', 1),
				new Choice('', 'no', 1/9),
				new Choice('', 'no', 1/9),
				new Choice('', 'no', 1/9),
				new Choice('', 'no', 1/9)
			]);
			expected[1].optionsByPriority = [
				new Choice('', 'yes', 1),
				new Choice('', 'no', 1/9),
				new Choice('', 'no', 1/9),
				new Choice('', 'no', 1/9),
				new Choice('', 'no', 1/9),
				new Choice('', 'no', 1/9),
				new Choice('', 'no', 1/9),
				new Choice('', 'no', 1/9),
				new Choice('', 'no', 1/9),
				new Choice('', 'no', 1/9)
			];

			expected[2] = new Voter('example.one@example.com', [
				new Choice('', 'undefined', 1/7),
				new Choice('', 'yes', 1/2),
				new Choice('', 'undefined', 1/7),
				new Choice('', 'undefined', 1/7),
				new Choice('', 'maybe', 1),
				new Choice('', 'undefined', 1/7),
				new Choice('', 'yes', 1/2),
				new Choice('', 'undefined', 1/7),
				new Choice('', 'undefined', 1/7),
				new Choice('', 'undefined', 1/7)
			]);
			expected[2].optionsByPriority = [
				new Choice('', 'yes', 1/2),
				new Choice('', 'yes', 1/2),
				new Choice('', 'maybe', 1),
				new Choice('', 'undefined', 1/7),
				new Choice('', 'undefined', 1/7),
				new Choice('', 'undefined', 1/7),
				new Choice('', 'undefined', 1/7),
				new Choice('', 'undefined', 1/7),
				new Choice('', 'undefined', 1/7),
				new Choice('', 'undefined', 1/7)
			];

			expected[3] = new Voter('example.allmoi@example.com', [
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10)
			]);
			expected[3].optionsByPriority = [
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10),
				new Choice('', 'yes', 1/10)
			];

			expected[1].userid = 'test.user.a';

			assert.deepStrictEqual(reader.parse(htmlString).voters, expected);
		});
	});


	describe('#resolveOptionNames', () => {
		it('assigns the correct option names to the choices', () => {
			const parsedData = reader.parse(htmlString);
			const expected = new Voter('Test-User-A', [
				new Choice('Kurs A (Dozent A)', 'no', 1/9),
				new Choice('Kurs B (Dozent B)', 'no', 1/9),
				new Choice('Kurs C (Dozent C)', 'no', 1/9),
				new Choice('Kurs D (Dozent D)', 'no', 1/9),
				new Choice('Kurs E (Dozent E)', 'no', 1/9),
				new Choice('Kurs F (Dozent F)', 'yes', 1),
				new Choice('Kurs G (Dozent G)', 'no', 1/9),
				new Choice('Kurs H (Dozent H)', 'no', 1/9),
				new Choice('Kurs I (Dozent I)', 'no', 1/9),
				new Choice('Kurs J (Dozent J)', 'no', 1/9)
			]);
			expected.optionsByPriority = [
				new Choice('Kurs F (Dozent F)', 'yes', 1),
				new Choice('Kurs A (Dozent A)', 'no', 1/9),
				new Choice('Kurs B (Dozent B)', 'no', 1/9),
				new Choice('Kurs C (Dozent C)', 'no', 1/9),
				new Choice('Kurs D (Dozent D)', 'no', 1/9),
				new Choice('Kurs E (Dozent E)', 'no', 1/9),
				new Choice('Kurs G (Dozent G)', 'no', 1/9),
				new Choice('Kurs H (Dozent H)', 'no', 1/9),
				new Choice('Kurs I (Dozent I)', 'no', 1/9),
				new Choice('Kurs J (Dozent J)', 'no', 1/9)
			];

			expected.userid = 'test.user.a';
			reader.resolveOptionNames(parsedData);

			assert.deepStrictEqual(parsedData.voters[1], expected);
		});
	});
});
