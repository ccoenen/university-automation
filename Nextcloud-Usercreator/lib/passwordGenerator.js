// WARNING THIS IS NOT A SECURE PASSWORD GENERATOR
// IT IS SPECIFICALLY INTENDED NOT TO BE. USERS HAVE TO
// RESET THEIR OWN PASSWORDS ASAP!
const crypto = require('crypto');
const fs = require('fs');


module.exports = function generatorFactory(path) {
	var salt = '';
	try {
		salt = fs.readFileSync(path).toString();
	} catch (dontcare) { /* nothing to do */ }

	if (!salt || salt.length < 100) {
		console.error(`create a ${path} file and fill it with random bytes`);
		process.exit(1);
	}

	return function passwordGenerator(input) {
		return crypto
			.createHash('sha256')
			.update(salt)
			.update(input)
			.digest('base64')
			.replace(/\W/g,'')
			.substr(0,16);
	};
};
