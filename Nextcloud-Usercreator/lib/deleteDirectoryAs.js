var webdav = require('webdav-fs');

module.exports = async function deleteDirectoryAs(dirname, auth) {
	console.log(`- attempting to delete ${dirname} as ${auth.user}`);
	return new Promise(function (fulfill, reject) {
		webdav(auth.path, {username: auth.user, password: auth.password}).unlink(dirname, function (err) {
			if (err && err.response.status !== 404) { // 404 is fine - we just want it gone.
				reject(`Delete failed for ${dirname} with ${err.message}`);
			} else {
				console.log(` ... ${dirname} no longer exists. ${err && err.response && err.response.status}`);
				fulfill();
			}
		});
	});
};
