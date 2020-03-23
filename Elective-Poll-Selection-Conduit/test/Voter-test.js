const assert = require('assert');

const { Choice } = require('../lib/Choice');
const { Option } = require('../lib/Option');
const { Voter } = require('../lib/Voter');


describe('Voter', function() {
	describe('#toString', () => {
		it('outputs a readable thing', () => {
			const v = new Voter('Bernd', [
				new Choice(new Option('A'), 'yes'),
				new Choice(new Option('B'), 'maybe')
			]);
			assert.strictEqual(v.toString(), '[Voter Bernd () [Choice [Option A]: yes], [Choice [Option B]: maybe]]');
		});
	});
});
