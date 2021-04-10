var webdav = require('webdav-fs');

module.exports = function createDirectoryAs(dirname, auth) {
	return new Promise(function (fulfill, reject) {
		webdav(auth.path, {username: auth.user, password: auth.password}).mkdir(dirname, function (err) {
			if (err) {
				reject(err);
			} else {
				fulfill();
			}
		});
	});
};
