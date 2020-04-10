module.exports = {
	histogram: function (voters) {
		const histogram = {
			perfect: 0,
			very: 0,
			mostly: 0,
			somewhat: 0,
			half: 0,
			shitty: 0
		};

		for (const v of voters) {
			const happiness = v.getHappiness();
			if (happiness >= 99) {
				histogram.perfect++;
			} else if (happiness >= 87) {
				histogram.very++;
			} else if (happiness >= 75) {
				histogram.mostly++;
			} else if (happiness >= 66) {
				histogram.somewhat++;
			} else if (happiness >= 50) {
				histogram.half++;
			} else {
				histogram.shitty++;
			}
		}

		return histogram;
	}
};
