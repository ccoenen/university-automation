const assert = require('assert');
const fs = require('fs');

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
				{ name: 'Test-User-C', choices: ['yes', 'maybe', 'undefined', 'yes', 'undefined', 'undefined', 'undefined', 'yes', 'maybe', 'undefined'] },
				{ name: 'Test-User-A', choices: ['no', 'no', 'no', 'no', 'no', 'yes', 'no', 'no', 'no', 'no'] },
				{ name: 'example.one@example.com', choices: ['undefined', 'yes', 'undefined', 'undefined', 'maybe', 'undefined', 'yes', 'undefined', 'undefined', 'undefined'] },
				{ name: 'example.allmoi@example.com', choices: ['yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes'] }
			];

			assert.deepStrictEqual(reader.parse(htmlString).voters, expected);
		});
	});
});
