var { moveDirectoriesAs } = require('./moveDirectoriesAs');

const timecode = process.env.TIMECODE; // "2019-SS";
const course = process.env.COURSE; // "P2";
const coursedigit = course[1];
const STUDENT_UPLOAD_REGEX = new RegExp(`Abgabe (\\D{1,3}${coursedigit}$)`);
const TEAM_UPLOAD_REGEX = new RegExp(`^${course} Team \\d{1,3} Abgabe$`);
const TEACHER_UPLOAD_REGEX = new RegExp(`^\\D{1,3}${coursedigit} Unterlagen$`);
const GENERAL_INFO_REGEX = new RegExp(`^\\D{1,3}${coursedigit} Administratives$`);

if (!timecode || !course) {
	console.error("please set TIMECODE and COURSE env vars!");
	process.exit(1);
}

const mover = async function (list, config) {
	for (let i = 0; i < list.length; i++) {
		const item = list[i];
		try {
			console.log("(%d/%d) moving %s ...", (i+1), list.length, item.userid);

			// teachers: base level will have all the individual upload dirs from students
			const results1 = await moveDirectoriesAs('/', STUDENT_UPLOAD_REGEX, `${timecode}-${course}/$1 Abgaben/`, [config.webdav_path, item.userid, item.password]);
			const results2 = await moveDirectoriesAs('/', TEAM_UPLOAD_REGEX, `${timecode}-${course}/$1 Gruppenabgaben/`, [config.webdav_path, item.userid, item.password]);

			// students: base level will have all the teachers' slides directories
			const results3 = await moveDirectoriesAs('/', TEACHER_UPLOAD_REGEX, `${timecode}-${course}/`, [config.webdav_path, item.userid, item.password]);
			const results4 = await moveDirectoriesAs('/', GENERAL_INFO_REGEX, `${timecode}-${course}/`, [config.webdav_path, item.userid, item.password]);

			console.log("  ... moved %d dirs for %s", (results1.length + results2.length + results3.length + results4.length), item.userid);
		} catch (err) {
			console.error("ERROR moving %s: %s", item.name, err);
		}
	}
};

module.exports = {
	mover
};
