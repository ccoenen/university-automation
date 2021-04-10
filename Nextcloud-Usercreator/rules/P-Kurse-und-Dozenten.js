const NC_PERMISSIONS = require('../lib/nextcloud-api-permissions');

const timecode = process.env.TIMECODE; // "2019-SS";
const course = process.env.COURSE; // "P2";
const coursedigit = course[1];

function usersAndShares(lists, config) {
	var users = [];
	let veranstaltungen = {};

	if (!timecode || !course) {
		console.error('please set TIMECODE and COURSE env vars!');
		process.exit(1);
	}

	const admin = {
		userid: config.adminuser,
		password: config.adminpwd,
		email: config.adminemail,
		groups: [
			`Studierende-${course}`,
			`Dozierende-${course}`,
			// 'P2-Team-1...', via loop
		],
		shares: {}
	};

	// @see https://docs.nextcloud.com/server/15/developer_manual/core/ocs-share-api.html#create-a-new-share
	admin.shares[`/${timecode}-${course}`] = []; // this will just create a directory.
	admin.shares[`/${timecode}-${course}/${course} Administratives`] = [
		{shareType: 1, shareWith: `Dozierende-${course}`, permissions: NC_PERMISSIONS.ALL},
		{shareType: 1, shareWith: `Studierende-${course}`, permissions: NC_PERMISSIONS.READ}
	];

	for (let teamID = 1; teamID <= 10; teamID++) {
		admin.groups.push(`${course}-Team-${teamID}`);
		admin.shares[`/${timecode}-${course}/${course} Team ${teamID} Intern`] = [
			{shareType: 1, shareWith: `${course}-Team-${teamID}`, permissions: NC_PERMISSIONS.ALL}
		];
		admin.shares[`/${timecode}-${course}/${course} Team ${teamID} Abgabe`] = [
			{shareType: 1, shareWith: `${course}-Team-${teamID}`, permissions: NC_PERMISSIONS.ALL},
			{shareType: 1, shareWith: `Dozierende-${course}`, permissions: NC_PERMISSIONS.READ}
		];
	}

	users.push(admin);

	lists[0].forEach((item) => {
		item.groups = [`Dozierende-${course}`];
		item.quota = '10GB';
		item.shares = {};

		// these will just create directories.
		item.shares[`/${timecode}-${course}`] = [];
		item.shares[`/${timecode}-${course}/${item.veranstaltung} Abgaben`] = [];
		// item.shares[`/${timecode}-${course}/${course} Gruppenabgaben`] = []; // removed, see under moveInstructions for why.

		if (item.tutor !== 'tutor') { // tutors don't get their own directories!
			item.shares[`/${timecode}-${course}/${item.veranstaltung} Unterlagen`] = [
				{shareType: 1, shareWith: `Dozierende-${course}`, permissions: NC_PERMISSIONS.READ},
				{shareType: 1, shareWith: `Studierende-${course}`, permissions: NC_PERMISSIONS.READ}
			];
		}
		users.push(item);
		if (!veranstaltungen[item.veranstaltung]) {
			veranstaltungen[item.veranstaltung] = [];
		}
		veranstaltungen[item.veranstaltung].push(item.userid);
	});

	lists[1].forEach((item) => {
		item.groups = [`Studierende-${course}`]; //, 'P2-Team-' + item.gruppe];
		item.shares = {};
		item.shares[`/${timecode}-${course}`] = []; // this will just create a directory.
		for (let v in veranstaltungen) {
			let s = item.shares[`/${timecode}-${course}/${item.name} Abgabe ${v}`] = [];
			veranstaltungen[v].forEach(dozent => {
				s.push({shareType: 0, shareWith: dozent, permissions: NC_PERMISSIONS.READ});
			});
		}

		users.push(item);
	});

	return users;
}


const STUDENT_UPLOAD_REGEX = new RegExp(`Abgabe (\\D{1,3}${coursedigit}$)`);
const TEAM_UPLOAD_REGEX = new RegExp(`^(${course}) Team \\d{1,3} Abgabe$`);
const TEAM_INTERNAL_REGEX = new RegExp(`^(${course}) Team \\d{1,3} Intern$`);
const TEACHER_UPLOAD_REGEX = new RegExp(`^\\D{1,3}${coursedigit} Unterlagen`);
const GENERAL_INFO_REGEX = new RegExp(`^\\D{1,3}${coursedigit} Administratives`);

const moveInstructions = [
	// format: search pattern, target directory

	// teachers: base level will have all the individual upload dirs from students
	{ pattern: STUDENT_UPLOAD_REGEX, target: `${timecode}-${course}/$1 Abgaben/` },
	{ pattern: TEAM_INTERNAL_REGEX, target: `${timecode}-${course}/` },
	{ pattern: TEAM_UPLOAD_REGEX, target: `${timecode}-${course}/` }, // for students
	// { pattern: TEAM_UPLOAD_REGEX, target: `${timecode}-${course}/$1 Gruppenabgaben/` }, // for teachers - this didn't work as it conflicted with the student case.

	// students: base level will have all the teachers' slides directories
	{ pattern: TEACHER_UPLOAD_REGEX, target: `${timecode}-${course}/` },
	{ pattern: GENERAL_INFO_REGEX, target: `${timecode}-${course}/` }
];


module.exports = {
	usersAndShares,
	moveInstructions
};
