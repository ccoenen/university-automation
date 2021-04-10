const { moveDirectoriesAs } = require('./moveDirectoriesAs');

const mover = async function (users, moveInstructions, config) {
	for (let i = 0; i < users.length; i++) {
		const user = users[i];
		console.log("(%d/%d) moving %s ...", (i+1), users.length, user.userid);

		let successfulMoves = 0;
		for (const instruction of moveInstructions) {
			try {
				const results = await moveDirectoriesAs('/', instruction.pattern, instruction.target, {path: config.webdav_path, user: user.userid, password: user.password});
				successfulMoves += results.length;
			} catch (err) {
				console.error("ERROR moving dirs for %s: %s", user.userid, err);
			}
		}
		console.log("  ... moved %d dirs for %s", successfulMoves, user.userid);
	}
};

module.exports = {
	mover
};
