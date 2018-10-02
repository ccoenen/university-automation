var webdav = require('webdav-fs');

module.exports = function createDirectoryAs(dirname, auth) {
	return new Promise(function (fulfill, reject) {
		webdav(auth[0], auth[1], auth[2]).mkdir(dirname, function (err) {
			if (err) {
				reject(err);
			} else {
				fulfill();
			}
		});
	});
};
