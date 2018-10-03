var mda = require('./moveDirectoriesAs');

module.exports = function (users, config) {
	return new Promise((resolve, reject) => {
		var all = [].concat(users); // copying the array, we're about to modify it

		function processNext() {
			var next = all.shift();
			if (!next) {return resolve();}
			console.log("moving %s, %d users left", next.userid, all.length);
			Promise.all([
				mda('/', /^\w+1.+/, 'Semester-1/', [config.webdav_path, next.userid, next.password]),
				mda('/', /^\w+2.+/, 'Semester-2/', [config.webdav_path, next.userid, next.password]),
				mda('/', /^\w+3.+/, 'Semester-3/', [config.webdav_path, next.userid, next.password]),
				mda('/', /^\w+4.+/, 'Semester-4/', [config.webdav_path, next.userid, next.password]),
				mda('/', /^\w+5.+/, 'Semester-5/', [config.webdav_path, next.userid, next.password]),
				mda('/', /^\w+6.+/, 'Semester-6/', [config.webdav_path, next.userid, next.password]),
				mda('/', /^\w+7.+/, 'Semester-7/', [config.webdav_path, next.userid, next.password])
			]).then((results) => {
				console.log("moved %d dirs for %s", (results[0].length + results[1].length + results[2].length), next.userid);
				processNext();
			}).catch((ex) => {
				console.error("ERROR: ", ex);
			});
		}
		processNext();
	});
};
