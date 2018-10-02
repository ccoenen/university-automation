# Nextcloud User Creator

Automated creation of nextcloud users, including

* user-id
* password
* display name
* email
* groups
* automated creation of shares

## Configuration

* copy `config/server.js.example` to be `config/server.js`, and fill in all the fields.
* copy `password-mail.mustache.example` to `password-mail.mustache` and make modifications as you see fit.
* (If you use csvreader) Create a file `password.salt` in the `input-data`-directory.

## Simple example

write your own `example.js` file, enter:

```javascript
const creator = require('./lib/creator');
const BASE_OPTIONS = require('./config/server');
creator.init(BASE_OPTIONS);

var users = [];
users.push({
	userid: 'test-1',
	name: 'Test User Number One',
	email: 'nobody@example.com',
	password: 'change-me',
	groups: ['Wallawalla'],
});

creator.create(users, true /* reset password */, true /* send mail */);
```

users need to have at least the `userid` and `password` fields. Everything else is optional.

you can push as many users into this array as you like, they will be created one by one.
