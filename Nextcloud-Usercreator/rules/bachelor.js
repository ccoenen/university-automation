const NC_PERMISSIONS = require('../lib/nextcloud-api-permissions');

const timecode = process.env.TIMECODE; // "2019-SS";
const MAIN_SORTING_DIRECTORY = `/${timecode}-P7`

function usersAndShares(lists, config) {
	const users = [];

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

	// @see https://docs.nextcloud.com/server/15/developer_manual/core/ocs-share-api.html#create-a-new-share
	admin.shares[MAIN_SORTING_DIRECTORY] = []; // this will just create a directory.
	admin.shares[`${MAIN_SORTING_DIRECTORY}/P7 Administratives`] = [
		{shareType: 1, shareWith: 'Studierende-P7', permissions: NC_PERMISSIONS.READ},
		{shareType: 1, shareWith: 'Dozierende-P7', permissions: NC_PERMISSIONS.ALL}
	];

	users.push(admin);

	lists[0].forEach((item) => {
		item.groups = ['Dozierende-P7'];
		item.shares = {};
		item.shares[MAIN_SORTING_DIRECTORY] = [];
		users.push(item);
	});

	lists[1].forEach((item) => {
		item.groups = ['Studierende-P7'];
		item.shares = {};
		item.shares[MAIN_SORTING_DIRECTORY] = []; // this will just create a directory.
		item.shares[`${MAIN_SORTING_DIRECTORY}/${item.name} Bachelormodul ${timecode}`] = [
			{shareType: 1, shareWith: 'Dozierende-P7', permissions: NC_PERMISSIONS.READ_AND_SHARE}
		];
		item.shares[`${MAIN_SORTING_DIRECTORY}/${item.name} Researchmodul ${timecode}`] = [
			{shareType: 1, shareWith: 'Dozierende-P7', permissions: NC_PERMISSIONS.READ_AND_SHARE}
		];
		users.push(item);
	});

	return users;
}

const BACHELOR_REGEX = new RegExp(`(Bachelor|Research)modul ${timecode}`);
const GENERAL_INFO_REGEX = new RegExp(`^P7 Administratives$`);
const moveInstructions = [
	{ pattern: BACHELOR_REGEX, target: MAIN_SORTING_DIRECTORY },
	{ pattern: GENERAL_INFO_REGEX, target: MAIN_SORTING_DIRECTORY }
];

module.exports = {
	usersAndShares,
	moveInstructions
};
