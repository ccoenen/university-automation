module.exports = function (lists, config) {
	const users = [];

	console.log(lists);
	console.log(config);

	users.push({
		userid: 'test-1',
		password: 'change-me',
	});
	return users;
};
