const fs = require('fs');
const csv = require('fast-csv');

const passwordGenerator = require('./passwordGenerator')('input-data/password.salt');


function nameFromRow(row) {
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
		console.warn("No name, Name, Vorname, Nachname fields found in ", row);
		return;
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
	return name.toLowerCase().replace(/ /g, '.').replace(/ä/g, 'ae').replace(/ü/g, 'ue').replace(/ö/g, 'oe').replace(/ß/g, 'ss');
}

module.exports = function read(filename) {
	return new Promise(function (fulfill, reject) {
		var fileStream = fs.createReadStream(filename);
		var lines = [];

		var csvStream = csv({headers: true, trim: true, comment: '#'})
			.on('data', (data) => {
				var preparedObject = {
					email: data.email,
					name: nameFromRow(data),
				};

				preparedObject.userid = data.userid || useridFromEmail(preparedObject.email) || useridFromName(preparedObject.name);
				preparedObject.userid = preparedObject.userid.toLowerCase();
				preparedObject.password = passwordGenerator(preparedObject.userid);

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
				console.error(`Failed to parse ${filename}: ${err.message}`);
				process.exit(1);
			});
		
		fileStream.pipe(csvStream);
	});
};
