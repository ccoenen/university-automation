const fsp = require('fs').promises;
const path = require('path');

const {removeTitlePage} = require('./helpers');

module.exports = {
	check: function (papers) {
		papers.forEach(p => {
			if (!p.supervisor) {
				console.error(`this paper does not have a supervisor: ${p.author} ${p.randomIdenfitier}`);
			}
		});
		return papers;
	},

	getUniqueSupervisors: function (papers) {
		// collect in an object's keys, so it's unique by default.
		const temp = {};
		papers.forEach(p => temp[p.supervisor] = '');
		return Object.keys(temp);
	},

	createTargetDirs: function (papers) {
		const supervisors = module.exports.getUniqueSupervisors(papers);
		const promises = supervisors.map(s => {
			return Promise.all([
				fsp.mkdir(`${s}/Anonym`, {recursive: true}),
				fsp.mkdir(`${s}/Namentlich`, {recursive: true})
			]);
		});
		
		return Promise.all(promises).then(() => papers);
	},
	
	writeSupervisionFiles: function (papers) {
		papers.forEach((p) => {
			removeTitlePage(p, path.resolve(p.supervisor, `Anonym/P3_191108_${p.randomIdentifier}_Paper.pdf`));
		});
		papers.forEach((p) => {
			p.collectReviews(path.resolve(p.supervisor, `Namentlich/P3_191108_${p.title}_${p.author}_Reviews.txt`));
		});
		papers.forEach((p) => {
			fsp.copyFile(p.filename, path.resolve(p.supervisor, `Namentlich/P3_191108_${p.title}_${p.author}_Paper.pdf`));
		});
		return papers;
	}

};
