var mda = require('./moveDirectoriesAs');

const timecode = process.env.TIMECODE; // "2019-SS";
const course = process.env.COURSE; // "P2";
const coursedigit = course[1];
const regex = new RegExp(`^\\D{1,3}${coursedigit}`);

if (!timecode || !course) {
	console.error("please set TIMECODE and COURSE env vars!");
	process.exit(1);
}

module.exports = function (users, config) {
	return new Promise((resolve, reject) => {
		var all = [].concat(users); // copying the array, we're about to modify it

		function processNext() {
			var next = all.shift();
			if (!next) {return resolve();}
			console.log("moving %s, %d users left", next.userid, all.length);
			mda('/', regex, `${timecode}-${course}/`, [config.webdav_path, next.userid, next.password]).then((results) => {
				console.log("moved %d dirs for %s", (results.length), next.userid);
				processNext();
			}).catch((ex) => {
				console.error("ERROR: ", ex);
			});
		}
		processNext();
	});
};
