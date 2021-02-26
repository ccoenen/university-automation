const NC_PERMISSIONS = require('../lib/nextcloud-api-permissions');

const timecode = process.env.TIMECODE; // "2019-SS";
const title = process.env.ELECTIVETITLE; // "Physical Interaction";
const GROUPNAME = `${title}`;

if (!timecode || !title) {
	console.error("please set TIMECODE and ELECTIVETITLE env vars!");
	process.exit(1);
}

if (title.indexOf('/') !== -1) {
	console.error("title cannot contain \"/\"!");
	process.exit(1);
}

function usersAndShares(lists /*, config */) {
	var users = [];

	lists[0].forEach((item, index) => {
		item.groups = [
			GROUPNAME
		];
		item.quota = '10GB';
		item.shares = {};

		// first one creates the share and shares it with everyone else in the teaching staff
		if (index === 0) {
			// /2020-SS-DTM2 Unterlagen
			item.shares[`/${timecode}-${title} Unterlagen`] = [
				{shareType: 1, shareWith: GROUPNAME, permissions: NC_PERMISSIONS.READ}
			].concat(lists[0].map((i) => {return {shareType: 0, shareWith: i.userid, permissions: NC_PERMISSIONS.READ};}));
		}
		// /2020-SS-DTM2 Abgaben
		item.shares[`/${timecode}-${title} Abgaben`] = [];

		users.push(item);
	});

	lists[1].forEach((item) => {
		item.groups = [GROUPNAME];
		item.shares = {};
		// /2020-SS-DTM2 Bernd Brot Abgabe
		item.shares[`/${timecode}-${title} ${item.name} Abgabe`] = lists[0].map(i => {
			return {shareType: 0, shareWith: i.userid, permissions: NC_PERMISSIONS.READ}
		});

		users.push(item);
	});

	return users;
}

const STUDENT_UPLOAD_REGEX = new RegExp(`^${timecode}-${title} .+ Abgabe$`);

const moveInstructions = [
	// format: search pattern, target directory

	// teachers: base level will have all the individual upload dirs from students
	{ pattern: STUDENT_UPLOAD_REGEX, target: `/${timecode}-${title} Abgaben/` },
];


module.exports = {
	usersAndShares,
	moveInstructions
};
