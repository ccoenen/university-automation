var webdav = require('webdav-fs');

function moveDirectoriesAs(sourceDirectory, sourceRegex, destinationDirectory, auth) {
	return new Promise(function (fulfill, reject) {
		var dav = webdav(auth.path, {username: auth.user, password: auth.password});

		dav.readdir(sourceDirectory, (error, contents) => {
			var successfulMoves = [];
			if (error) {
				reject(error);
				return;
			}

			// console.log(`- test ${sourceDirectory} for ${sourceRegex}`)
			var matches = contents.map((item) => {
				if (sourceRegex.test(item)) {
					// console.log(`  + <${item}>`);
					return (item);
				} else {
					// console.log(`  - <${item}>`);
				}
			}).filter(function (a) {return !!a;});

			if (matches.length > 0) {
				moveNext();
			} else {
				fulfill(successfulMoves);
			}


			function moveNext() {
				var item = matches.pop();
				let mutatedDestinationDirectory

				if (!item) {
					fulfill(successfulMoves);
					return;
				}
				if (item.match(sourceRegex)[1]) {
					mutatedDestinationDirectory = destinationDirectory.replace("$1", item.match(sourceRegex)[1]);
				} else {
					mutatedDestinationDirectory = destinationDirectory;
				}

				console.log('  - renaming %s to %s', sourceDirectory + item, mutatedDestinationDirectory + item);
				dav.mkdir(mutatedDestinationDirectory, () => {
					dav.rename(sourceDirectory + item, mutatedDestinationDirectory + item, (error) => {
						if (error) {
							reject(error);
						} else {
							successfulMoves.push(item);
							moveNext();
						}
					});
				});
			}
		});
	});
}
module.exports = {
	moveDirectoriesAs
};
