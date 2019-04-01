module.exports = function (lists, config) {
	var users = [];

	const timecode = process.env.TIMECODE; // "2019-SS";
	if (!timecode) {
		console.error("please set TIMECODE env var!");
		process.exit(1);
	}

	users.push({
		userid: config.adminuser,
		password: config.adminpwd,
		email: config.adminemail,
		groups: [
			'Studierende-Bachelor',
			'Dozierende-Bachelor',
		],
		shares: {}
	});
	
	users[0].shares[`/${timecode}-Bachelor`] = [], // this will just create a directory.
	users[0].shares[`/${timecode}-Bachelor/P7 Bachelor Unterlagen`] = {shareType: 1, shareWith: 'Studierende-Bachelor', permissions: 1},
	users[0].shares[`/${timecode}-Bachelor/P7 Bachelor Unterlagen`] = {shareType: 1, shareWith: 'Dozierende-Bachelor', permissions: 31},

	lists[0].forEach((item) => {
		item.groups = ['Studierende-Bachelor'];
		item.shares = {};
		item.shares[`/${timecode}-Bachelor`] = []; // this will just create a directory.
		item.shares[`/${timecode}-Bachelor/P7 Bachelor ${item.name}`] = [];
		users.push(item);
	});
	
	return users;
};
