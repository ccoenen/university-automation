function usersAndShares(lists) {
	var users = [];

	lists[0].forEach((item) => {
		item.groups = [`Studierende-2020-SS`]; //, 'P2-Team-' + item.gruppe];
		users.push(item);
	});

	return users;
}

module.exports = {
	usersAndShares
};
