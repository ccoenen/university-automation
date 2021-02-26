const NC_PERMISSIONS = require('../lib/nextcloud-api-permissions');

const TIMECODE = process.env.TIMECODE; // "2019-SS";
const COURSE = process.env.COURSE; // "FP2";
const BASENAME1 = `/${TIMECODE}-${COURSE}/`;
const BASENAME2 = `${BASENAME1}${COURSE} Forschungsarbeiten/`;

function usersAndShares(lists, config) {
	const users = [];

	if (!TIMECODE || !COURSE) {
		console.error("please set TIMECODE and COURSE env vars!");
		process.exit(1);
	}

	const admin = {
		userid: config.adminuser,
		password: config.adminpwd,
		email: config.adminemail,
		shares: {}
	};

	// @see https://docs.nextcloud.com/server/15/developer_manual/core/ocs-share-api.html#create-a-new-share
	admin.shares[BASENAME1] = []; // this will just create a directory.
	admin.shares[BASENAME2] = []; // this will just create a directory.

	users.push(admin);

	lists[0].forEach((item) => {
		// all of these belong to admin, this is intentional
		admin.shares[`${BASENAME2}${COURSE} Forschungsarbeit ${item.name}`] = [{
			shareType: 0,
			shareWith: item.userid,
			permissions: NC_PERMISSIONS.ALL
		}];

		users.push(item); // we want all the users in there for the subsequent move
	});

	return users;
}

module.exports = {
	usersAndShares
};
