function usersAndShares(lists) {
	var users = [];

	const groupname = process.env.GROUPNAME; // "Mitarbeiter";
	if (!groupname) {
		console.error("please set GROUPNAME env var!");
		process.exit(1);
	}

	lists.forEach((list) => {
		list.forEach((item) => {
			item.groups = [groupname];
			users.push(item);
		});
	});

	return users;
}

module.exports = {
	usersAndShares
};
