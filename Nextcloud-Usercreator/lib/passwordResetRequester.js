// We need this to build our post string
var querystring = require('querystring');
var https = require('https');

var Promise = require('bluebird');

var host = '';
var nextcloudPath = '/';

function getCookiesAndToken(callback) {
	var options = {
		host: host,
		port: '443',
		path: nextcloudPath + 'index.php/login'
	};

	// Set up the request
	https.get(options, function(res) {
		res.setEncoding('utf8');

		// console.log('GCAT statusCode: ', res.statusCode);

		var responseCookies = res.headers['set-cookie'];
		var requestCookies='';
		for(var i=0; i<responseCookies.length; i++){
			var oneCookie = responseCookies[i];
			oneCookie = oneCookie.split(';');
			requestCookies= requestCookies + oneCookie[0]+';';
		}

		// console.log(requestCookies);

		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function(){
			var match = data.match(/data-requesttoken="([^"]+)"/);
			var requesttoken = match[1];
			// console.log(requesttoken);
			callback.call(null, requestCookies, requesttoken);
		});

	});
}

function passwordResetRequest(user, cookies, token, fulfill, reject) {
	var data = querystring.stringify({ 'user': user });
	
	var options = {
		method: 'POST',
		host: host,
		port: '443',
		path: nextcloudPath + 'index.php/lostpassword/email',
		headers: {
			'Cookie': cookies,
			'requesttoken': token,
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(data)
		}
	};

	// Set up the request
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');

		console.log('RR statusCode: %s (%s)', res.statusCode, user);
		// console.log('headers: ', res.headers);

		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function () {
			if (parseInt(res.statusCode, 10) == 200) {
				fulfill();
			} else {
				reject(data);
			}
		});
	});
	
	// post the data
	req.write(data);
	req.end();
}

function requestPasswordPromise(user) {
	return new Promise((fulfill, reject) => {
		getCookiesAndToken(function (cookies, token) {
			passwordResetRequest(user.userid, cookies, token, fulfill, reject);
		});
	});
}

module.exports = {
	init: function init(hostname, pathname = '/') {
		host = hostname;
		nextcloudPath = pathname;
	},
	requestForAll: function requestForAll(users) {
		return Promise.mapSeries(users, requestPasswordPromise, {concurrency: 1});
	}
};
