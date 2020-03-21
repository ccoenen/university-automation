const assert = require('assert');

const { Choice, PREFERENCE } = require('../lib/Choice');


describe('Choice', function() {
	describe('Choice.compare', () => {
		const y = new Choice('test-yes', PREFERENCE.YES);
		const m = new Choice('test-maybe', PREFERENCE.MAYBE);
		const n = new Choice('test-no', PREFERENCE.NO);
		const u = new Choice('test-undefined', PREFERENCE.UNDEFINED);


		it('compares correctly', () => {
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

		it('throws an error if one is not a choice', () => {
			assert.throws(() => {
				Choice.compare(n, {});
			});
		});

	});
});
