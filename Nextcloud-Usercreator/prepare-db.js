const { NodeSSH } = require('node-ssh');
const read = require('read');

const BASE_OPTIONS = require('./config/server');
let sudoPassword;

async function getPassword() {
	return new Promise((resolve, reject) => {
		read({ prompt: 'Requires SUDO-Password for that server: ', silent: true }, function(err, password) {
			if (!err) {
				resolve(password);
			} else {
				reject(err);
			}
		});
	});
}
  
async function run(commands) {
	const ssh = new NodeSSH();

	await ssh.connect({
		host: BASE_OPTIONS.hostname,
		username: BASE_OPTIONS.sshUser,
		agent: 'pageant',
		//   privateKey: '/home/brooks/.ssh/id_rsa'
	});

	for (const command of commands) {
		const res = await ssh.execCommand(command[0], command[1]);
		console.log('STDOUT: ' + res.stdout);
		console.log('STDERR: ' + res.stderr);
		if (res.code || res.signal) {
			console.log(res);
			console.log(`code: ${res.code}`);
			throw 'the previous command did not finish correctly, see above for details';
		}
	}

	ssh.dispose();
}

function sqlCommand(sql) {
	if (sql.indexOf('\'') > -1) {
		throw `sql commands currently can't contain the single quote character.\ncommand: ${sql}`;
	}
	return [`sudo -S sh -c 'docker-compose exec -T db mysql -v -v --user=${BASE_OPTIONS.mysqlUser} --password=${BASE_OPTIONS.mysqlPw} nextcloud <<EOFMYSQL
${sql}
EOFMYSQL'`, {stdin: sudoPassword, cwd: '/var/docker-services/nextcloud'}];
}


getPassword()
	.then(pw => {
		sudoPassword = pw;
		const addColumn = sqlCommand('ALTER TABLE oc_users ADD COLUMN password_temp VARCHAR(255) AFTER password;');
		const backupPasswords = sqlCommand('UPDATE oc_users SET password_temp = password');
		const restorePreviousPasswords = sqlCommand('UPDATE oc_users SET password = password_temp WHERE password_temp IS NOT NULL;');
		const dropColumn = sqlCommand('ALTER TABLE oc_users DROP COLUMN password_temp;');

		const commands = [
			// // ADD ANY OF THESE COMMANDS!
			// addColumn,
			// backupPasswords,
			restorePreviousPasswords,
			// dropColumn,
		];

		return run(commands);
	})
	.catch((err) => {
		console.error('something went wrong:');
		console.error(err);
		process.exit(1);
	});
