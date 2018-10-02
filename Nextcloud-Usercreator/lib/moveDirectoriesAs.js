var webdav = require('webdav-fs');

function moveDirectoriesAs(sourceDirectory, sourceRegex, destinationDirectory, auth) {
	return new Promise(function (fulfill, reject) {
		var dav = webdav(auth[0], auth[1], auth[2]);

		dav.readdir(sourceDirectory, (error, contents) => {
			var successfulMoves = [];
			if (error) {
				reject(error);
				return;
			}

			var matches = contents.map((item) => {
				if (item.match(sourceRegex)) {
					return (item);
				}
			}).filter(function (a) {return !!a;});

			if (matches.length > 1) { // not actually a clean condition, but works for my use-case
				dav.mkdir(destinationDirectory, () => {
					moveNext();
				});
			} else {
				fulfill(successfulMoves);
			}


			function moveNext() {
				var item = matches.pop();
				if (!item) {
					fulfill(successfulMoves);
					return;
				}

				console.log('  - renaming %s to %s', sourceDirectory + item, destinationDirectory + item);
				dav.rename(sourceDirectory + item, destinationDirectory + item, (error) => {
					if (error) {
						reject(error);
					} else {
						successfulMoves.push(item);
						moveNext();
					}
				});
			}
		});
	});
}
module.exports = moveDirectoriesAs;
