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
* Create a file `password.salt` in the `input-data`-directory.

## Ingredients

- a rule file
- one or more users lists (CSV files)

### Rule File example

write your own `example.js` file, it needs to be a module and return exactly one function. This function gets all the user lists (in the order specified on the command line) and the global config object.

It should return a modified, processed or filtered list of users.

```javascript
module.exports = function (lists, config) {
	var users = [];
	users.push({
		userid: 'test-1',
		name: 'Test User Number One',
		email: 'nobody@example.com',
		password: 'change-me',
		groups: ['Wallawalla'],
	});
	return users;
};
```

users need to have at least the `userid` and `password` fields. Everything else is optional.

you can push as many users into this array as you like, they will be created one by one.

### User List Files

CSV files must be comma separated. They must contain header fields in the first line.
There must be columns for

- `email`
- `name` or (`Vorname` and `Nachname`) or a few obscure combinations thereof.

They may specify "userid", otherwise the userid is generated from the email field.

## Usage

`node index.js --rules <a javascript file> --list <a csv file> --list <another csv file> --create-users --overwrite-passwords --move-directories --send-mails`

would be a full example.
