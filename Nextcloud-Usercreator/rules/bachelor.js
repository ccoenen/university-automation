const timecode = process.env.TIMECODE; // "2019-SS";

function usersAndShares(lists, config) {
	var users = [];

	if (!timecode) {
		console.error("please set TIMECODE env var!");
		process.exit(1);
	}

	const admin = {
		userid: config.adminuser,
		password: config.adminpwd,
		email: config.adminemail,
		groups: [
			'Studierende-P7',
			'Dozierende-P7',
		],
		shares: {}
	};
	users.push(admin);

	// @see https://docs.nextcloud.com/server/15/developer_manual/core/ocs-share-api.html#create-a-new-share
	admin.shares[`/${timecode}-P7`] = []; // this will just create a directory.
	admin.shares[`/${timecode}-P7/P7 Administratives`] = [
		{shareType: 1, shareWith: 'Studierende-P7', permissions: 1},
		{shareType: 1, shareWith: 'Dozierende-P7', permissions: 31}
	];

	lists[0].forEach((item) => {
		item.groups = ['Dozierende-P7'];
		item.shares = {};
		item.shares[`/${timecode}-P7`] = [];
		users.push(item);
	});

	lists[1].forEach((item) => {
		item.groups = ['Studierende-P7'];
		item.shares = {};
		item.shares[`/${timecode}-P7`] = []; // this will just create a directory.
		item.shares[`/${timecode}-P7/P7 Bachelor Abgabe ${item.name}`] = [
			{shareType: 1, shareWith: 'Dozierende-P7', permissions: 1}
		];
		item.shares[`/${timecode}-P7/R7 Research Abgabe ${item.name}`] = [
			{shareType: 1, shareWith: 'Dozierende-P7', permissions: 1}
		];
		users.push(item);
	});

	return users;
}

const BACHELOR_REGEX = new RegExp(`^[PR]7 (Bachelor|Research) Abgabe`);
const GENERAL_INFO_REGEX = new RegExp(`^P7 Administratives$`);
const moveInstructions = [
	{ pattern: BACHELOR_REGEX, target: `${timecode}-P7/` },
	{ pattern: GENERAL_INFO_REGEX, target: `${timecode}-P7/` }
];

module.exports = {
	usersAndShares,
	moveInstructions
};
