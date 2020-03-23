const assert = require('assert');

const { Choice, PREFERENCE } = require('../lib/Choice');
const { Option } = require('../lib/Option');


describe('Choice', function() {
	describe('Choice.compare', () => {
		const y = new Choice(new Option('test-yes'), PREFERENCE.YES);
		const m = new Choice(new Option('test-maybe'), PREFERENCE.MAYBE);
		const u = new Choice(new Option('test-undefined'), PREFERENCE.UNDEFINED);
		const n = new Choice(new Option('test-no'), PREFERENCE.NO);

		const yPopular = new Choice(new Option('test-pop-yes'), PREFERENCE.YES);
		const mPopular = new Choice(new Option('test-pop-maybe'), PREFERENCE.MAYBE);
		const uPopular = new Choice(new Option('test-pop-undefined'), PREFERENCE.UNDEFINED);
		const nPopular = new Choice(new Option('test-pop-no'), PREFERENCE.NO);

		y.option.popularity = 5;
		m.option.popularity = 5;
		n.option.popularity = 5;
		u.option.popularity = 5;
		yPopular.option.popularity = 7;
		mPopular.option.popularity = 7;
		nPopular.option.popularity = 7;
		uPopular.option.popularity = 7;

		it('compares correctly when no popularity is present', () => {
			assert.strictEqual(Choice.compare(y, y), 0);
			assert.strictEqual(Choice.compare(y, m), -1);
			assert.strictEqual(Choice.compare(y, u), -1);
			assert.strictEqual(Choice.compare(y, n), -1);

			assert.strictEqual(Choice.compare(m, y), 1);
			assert.strictEqual(Choice.compare(m, m), 0);
			assert.strictEqual(Choice.compare(m, u), -1);
			assert.strictEqual(Choice.compare(m, n), -1);

			assert.strictEqual(Choice.compare(u, y), 1);
			assert.strictEqual(Choice.compare(u, m), 1);
			assert.strictEqual(Choice.compare(u, u), 0);
			assert.strictEqual(Choice.compare(u, n), -1);

			assert.strictEqual(Choice.compare(n, y), 1);
			assert.strictEqual(Choice.compare(n, m), 1);
			assert.strictEqual(Choice.compare(n, u), 1);
			assert.strictEqual(Choice.compare(n, n), 0);
		});

		it('compares correctly when popularity has to be accounted for', () => {
			assert.strictEqual(Choice.compare(y, yPopular), -1);
			assert.strictEqual(Choice.compare(m, mPopular), -1);
			assert.strictEqual(Choice.compare(u, uPopular), -1);
			assert.strictEqual(Choice.compare(n, nPopular), -1);
		});

		it('throws an error if one is not a choice', () => {
			assert.throws(() => {
				Choice.compare(n, {});
			});
		});

	});
});
