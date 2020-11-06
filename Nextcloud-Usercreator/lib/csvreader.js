const fs = require('fs');
const csv = require('fast-csv');

const passwordGenerator = require('./passwordGenerator')('input-data/password.salt');


function nameFromRow(row, filename) {
	/*jshint -W069 */
	var name = '';

	if (row['name']) {
		// prepared name field
		name = row['name'];
	} else if (row['Nachname, Vorname'] || row['Name, Vorname'] || row['Nachname, Name']) {
		// reverse names in one field
		name = (row['Nachname, Vorname'] || row['Name, Vorname'] || row['Nachname, Name']).split(',').reverse().join(' ');
	} else if (row['Vorname'] && (row['Nachname'] || row['Name']))  {
		// single serving fields
		name = row['Vorname'] + ' ' + (row['Nachname'] || row['Name']);
	} else {
		throw new Error(`No name, Name, Vorname, Nachname fields found in ${JSON.stringify(row)} (filename: ${filename})`);
	}
	return name.trim();
}

function useridFromEmail(email) {
	if (email) {
		var parts = email.split('@');
		return parts[0].toLowerCase();
	}
}

function useridFromName(name) {
	console.warn(`WARNING: no mail address or userid specified, defaulting to username generated from given name "${name}"`);
	return name.toLowerCase().replace(/ /g, '.').replace(/ä/g, 'ae').replace(/ü/g, 'ue').replace(/ö/g, 'oe').replace(/ß/g, 'ss');
}

module.exports = function read(filename) {
	return new Promise(function (fulfill, reject) {
		var fileStream = fs.createReadStream(filename);
		var lines = [];

		var csvStream = csv({headers: true, trim: true, comment: '#'})
			.on('data', (data) => {
				var preparedObject = {
					email: data.email || data['E-Mail'],
					name: nameFromRow(data, filename),
				};

				preparedObject.userid = data.userid || useridFromEmail(preparedObject.email) || useridFromName(preparedObject.name);
				preparedObject.userid = preparedObject.userid.toLowerCase();
				preparedObject.password = passwordGenerator(preparedObject.userid);

				if (data.gruppe) { preparedObject.gruppe = data.gruppe; }
				if (data.Gruppe) { preparedObject.gruppe = data.Gruppe; }
				if (data.veranstaltung) { preparedObject.veranstaltung = data.veranstaltung; }
				if (data.Veranstaltung) { preparedObject.veranstaltung = data.Veranstaltung; }
				if (data.tutor) { preparedObject.tutor = data.tutor; }
				if (data.Tutor) { preparedObject.tutor = data.Tutor; }

				if (preparedObject.name.length < 1 || preparedObject.userid.length < 1) {
					console.warn("skipping entry in %s because of missing name or userid\n  Row: %s\n  Object: %s", filename, JSON.stringify(data), JSON.stringify(preparedObject));
				} else {
					lines.push(preparedObject);
				}
			})

			.on('end', () => {
				console.log('CSV %s has been parsed, %d entries', filename, lines.length);
				fulfill(lines);
			})

			.on('error', (err) => {
				return reject(`Failed to parse ${filename}: ${err.message}`);
			});
		
		fileStream.pipe(csvStream);
	});
};
