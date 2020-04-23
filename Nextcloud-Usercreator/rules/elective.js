const timecode = process.env.TIMECODE; // "2019-SS";
const title = process.env.ELECTIVETITLE; // "Physical Interaction";
const GROUPNAME = `Elective ${title}`;

if (!timecode || !title) {
	console.error("please set TIMECODE and ELECTIVETITLE env vars!");
	process.exit(1);
}

if (title.indexOf('/') !== -1) {
	console.error("elective title cannot contain \"/\"!");
	process.exit(1);
}

function usersAndShares(lists /*, config */) {
	var users = [];

	lists[0].forEach((item, index) => {
		item.groups = [
			'Dozierende-Electives',
			GROUPNAME
		];
		item.quota = '10GB';
		item.shares = {};

		item.shares[`/${timecode}-Electives`] = [];

		// first one creates the share and shares it with everyone else in the teaching staff
		if (index === 0) {
			// /2020-SS-Electives/Physical Interaction Unterlagen
			item.shares[`/${timecode}-Electives/${title} Unterlagen`] = [
				{shareType: 1, shareWith: GROUPNAME, permissions: 31}
			].concat(lists[0].map((i) => {return {shareType: 0, shareWith: i.userid, permissions: 1};}));
		}
		// /2020-SS-Electives/Physical Interaction Abgaben
		item.shares[`/${timecode}-Electives/${title} Abgaben`] = [];

		users.push(item);
	});

	lists[1].forEach((item) => {
		item.groups = [GROUPNAME];
		item.shares = {};
		item.shares[`/${timecode}-Electives`] = [];
		// /2020-SS-Electives/Bernd Brot Abgabe Physical Interaction
		item.shares[`/${timecode}-Electives/${item.name} Abgabe ${title}`] = lists[0].map(i => {
			return {shareType: 0, shareWith: i.userid, permissions: 1}
		});

		users.push(item);
	});

	return users;
}

const STUDENT_UPLOAD_REGEX = new RegExp(` Abgabe ${title}$`);
const TEACHER_UPLOAD_REGEX = new RegExp(`^${title} Unterlagen$`);

const moveInstructions = [
	// format: search pattern, target directory

	// teachers: base level will have all the individual upload dirs from students
	{ pattern: STUDENT_UPLOAD_REGEX, target: `${timecode}-Electives/${title} Abgaben/` },

	// students: base level will have all the teachers' slides directories
	{ pattern: TEACHER_UPLOAD_REGEX, target: `${timecode}-Electives/` }
];


module.exports = {
	usersAndShares,
	moveInstructions
};
