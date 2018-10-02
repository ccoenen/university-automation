const csvreader = require('./csvreader');
var mda = require('./lib/moveDirectoriesAs');
var CONFIG = require('./config/server');

process.on("unhandledRejection", function(reason, p){
	console.log("Unhandled", reason, p); // log all your errors, "unsuppressing" them.
	throw reason; // optional, in case you want to treat these as errors
});

Promise.all([
	csvreader('input-data/students-p2-teams.csv'),
	csvreader('input-data/dozierende-p2.csv'),
]).then((results) => {
	var all = [].concat(results[0], results[1] /*, results[2], results[3], results[4], results[5] */);

	function processNext() {
		var next = all.shift();
		if (!next) {return;}
		console.log("moving %s, %d users left", next.userid, all.length);
		Promise.all([
			mda('/', /^P2.+/, 'P2/', [CONFIG.webdav_path, next.userid, next.password]),
			mda('/', /^P4.+/, 'P4/', [CONFIG.webdav_path, next.userid, next.password]),
			mda('/', /^P6.+/, 'P6/', [CONFIG.webdav_path, next.userid, next.password])
		]).then((results) => {
			console.log("moved %d dirs for %s", (results[0].length + results[1].length + results[2].length), next.userid);
			processNext();
		}, (err) => {
			console.error("ERROR: ", err);
		}).catch((ex) => {
			console.error("EXCEPTION: ", ex);
		});
	}
	processNext();
});
