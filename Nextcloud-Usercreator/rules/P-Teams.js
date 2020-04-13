function usersAndShares(lists) {
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
}

module.exports = {
	usersAndShares
};
