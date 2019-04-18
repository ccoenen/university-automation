module.exports = function (lists, config) {
	var users = [];

	lists[0].forEach((item) => {
		item.groups = [item.gruppe];
		users.push(item);
	});

	return users;
};
