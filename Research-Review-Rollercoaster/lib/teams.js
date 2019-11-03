const fs = require('fs');

const csv = require('fast-csv');

module.exports = {
	fromFile: function (papers, CONFIG) {
		return new Promise((resolve, reject) =>  {
			if (!CONFIG.TEAM_FILE) {
				console.warn('no team file specified, will skip the team step.');
				return resolve(papers);
			}

			const fileStream = fs.createReadStream(CONFIG.TEAM_FILE, {encoding: 'UTF-8'});

			const csvStream = csv({headers: true, trim: true, comment: '#'})
				.on('data', (data) => {
					const paper = papers.find((p) => p.author === data[CONFIG.TEAM_FILE_NAME || 'Name']);
					if (paper) {
						paper.authorTeam = data[CONFIG.TEAM_FILE_TEAM || 'Gruppe'];
					} else {
						console.warn(`No paper found for ${data.Name}`);
					}
				})

				.on('end', () => {
					papers.forEach(p => {
						if (!p.authorTeam) console.warn(`No Team found for ${p.author}`);
					});
					resolve(papers);
				})

				.on('error', (err) => {
					return reject(`Failed to parse ${CONFIG.TEAM_FILE}: ${err.message}`);
				});

			fileStream.pipe(csvStream);
		});
	}
};
