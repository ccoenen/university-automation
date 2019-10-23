module.exports = function (lists, config) {
	var users = [];

	const TIMECODE = process.env.TIMECODE; // "2019-SS";
	const COURSE = process.env.COURSE; // "P2";
	const BASENAME = `/${TIMECODE}-${COURSE}/${COURSE} Forschungsarbeiten/`;

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
	admin.shares[BASENAME] = []; // this will just create a directory.

	lists[0].forEach((item) => {
		// all of these belong to admin, this is intentional
		admin.shares[`${BASENAME}${COURSE} Forschungsarbeit ${item.name}`] = [{
			shareType: 0,
			shareWith: item.userid,
			permissions: 15
		}];
	});

	users.push(admin);
	return users;
};
