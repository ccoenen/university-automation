const assert = require('assert');
const fs = require('fs');

const reader = require('../lib/reader');
const Voter = require('../lib/voter');

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
				new Voter('Test-User-C', ['yes', 'maybe', 'undefined', 'yes', 'undefined', 'undefined', 'undefined', 'yes', 'maybe', 'undefined']),
				new Voter('Test-User-A', ['no', 'no', 'no', 'no', 'no', 'yes', 'no', 'no', 'no', 'no']),
				new Voter('example.one@example.com', ['undefined', 'yes', 'undefined', 'undefined', 'maybe', 'undefined', 'yes', 'undefined', 'undefined', 'undefined']),
				new Voter('example.allmoi@example.com', ['yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes'])
			];

			expected[1].userid = 'test.user.a';

			assert.deepStrictEqual(reader.parse(htmlString).voters, expected);
		});
	});
});
