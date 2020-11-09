const highlight = require('./helpers').highlight;

const MAXIMUM_AMOUNT_OF_REVIEWS = 2;

module.exports = {
	assign: function(papers) {
		let reviewers = []; // this way is very convoluted, but continuing in the place where the previous assignment left off gives better result than starting from the top of the list every time.
		papers.forEach((paper) => {
			let randomReviewer;
			const rejectionReasons = [];
			let tieBreaker = false;
			while (paper.reviewedBy.length < MAXIMUM_AMOUNT_OF_REVIEWS) {
				if (reviewers.length === 0) {
					if (tieBreaker) {
						console.error(`no solution for ${highlight(paper.author)} (${paper.randomIdentifier}) because\n${rejectionReasons.map(r => `- ${r}`).join('\n')}`);
						console.error(`  conclusion: ${paper.allReviewedBy()}`);
						break; // ends this paper's assignments
					} else {
						reviewers = [].concat(papers); // cloning the array
						tieBreaker = true;
					}
				}
				randomReviewer = reviewers.pop();
				const rejection = checkAuthorPair(paper, randomReviewer);
				if (rejection) {
					rejectionReasons.push(rejection);
				} else {
					paper.reviewedBy.push(randomReviewer);
					randomReviewer.reviewing.push(paper);
				}
			}
		});
		return papers;
	},

	check: function (papers) {
		papers.forEach(p => {
			if (p.reviewing.length !== MAXIMUM_AMOUNT_OF_REVIEWS) console.warn(`${highlight(p.author)} is not supposed to review ${p.reviewing.length} people (${p.reviewing})`);
			if (p.reviewedBy.length !== MAXIMUM_AMOUNT_OF_REVIEWS) console.warn(`${highlight(p.author)} is not supposed to be reviewed by ${p.reviewedBy.length} people (${p.reviewedBy})`);
		});
		return papers;
	}
};

function checkAuthorPair(paper, reviewer) {
	if (paper.author === reviewer.author) {
		return `${reviewer.author} can't review themselves`;
	} else if (paper.reviewedBy.includes(reviewer)) {
		return `${reviewer.author} already reviews this one`;
	} else if (paper.reviewing.includes(reviewer)) {
		return `${reviewer.author} is under review by ${paper.author}. No quid-pro-quos.`;
	} else if (paper.authorTeam && reviewer.authorTeam && paper.authorTeam === reviewer.authorTeam) {
		return `${reviewer.author} and ${paper.author} are on team ${paper.authorTeam}`;
	} else if (reviewer.authorTeam && paper.reviewedBy.map(r => r.authorTeam).includes(reviewer.authorTeam)) {
		return `${reviewer.author}'s Team ${paper.authorTeam} already reviews this. Must be one of: ${paper.reviewedBy.join(',')}`;
	} else if (reviewer.reviewing.length >= MAXIMUM_AMOUNT_OF_REVIEWS) {
		return `${reviewer.author} already has a lot of reviews to do`;
	}
	// else return nothing = no rejection
}
