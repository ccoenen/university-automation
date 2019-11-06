module.exports = function (lists, config) {
	var users = [];

	lists[0].forEach((item) => {
		if (item.gruppe) {
			item.groups = [item.gruppe];
			users.push(item);
		} else {
			console.warn(`No group info for ${item}`);
		}
	});

	return users;
};
