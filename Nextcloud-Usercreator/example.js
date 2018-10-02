const creator = require('./lib/creator');
const mailer = require('./mailer');
const BASE_OPTIONS = require('./config/server');
creator.init(BASE_OPTIONS);
mailer.init(BASE_OPTIONS);

var users = [];
users.push({
	userid: 'test-1',
	password: 'change-me',
});

// creator.create(users);
// mailer.sendToAll(users);
