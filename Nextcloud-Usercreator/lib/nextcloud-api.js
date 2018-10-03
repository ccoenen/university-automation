const https = require('https');
const xml2js = require('xml2js');
const querystring = require('querystring');

module.exports = function apiFactory(baseOptions) {
	var calls = 0;

	baseOptions.agent = new https.Agent({keepAlive: true});

	var api = {
		// funny helpers
		numberOfCalls: () => {return calls;},


		// high-level API
		createUser: (user) => {
			return new Promise(function (fulfill, reject) {
				api.get('cloud/users/' + user.userid).then((result) => {
					if (result.xml.ocs.meta[0].status[0] !== 'ok') {
						api.post('cloud/users', {
							userid: user.userid,
							password: user.password
						}).then((result) => {
							fulfill(result);
						}).catch(reject);
					} else {
						fulfill(result);
					}
				}).catch(reject);
			});
		},

		changeUserProperty: (userid, propertyName, propertyValue, opts) => {
			return api.put('cloud/users/' + userid, {
				key: propertyName,
				value: propertyValue
			}, opts);
		},

		setGroups: (userid, groups) => {
			var groupPromises = groups.map((g) => {
				return api.post('cloud/users/' + userid + '/groups', {
					groupid: g
				});
			});

			return Promise.all(groupPromises);
		},

		addGroups: (groups) => {
			var groupPromises = groups.map((g) => {
				return api.addGroup(g);
			});
			return Promise.all(groupPromises);
		},

		addGroup: (group) => {
			return api.post('cloud/groups', {
				groupid: group
			});
		},

		share: (path, audience, opts) => {
			if (!Array.isArray(audience)) {
				audience = [audience];
			}
			var promises = audience.map((a) => {
				return api.post('apps/files_sharing/api/v1/shares', {
					path: path,
					shareType: a.shareType,
					shareWith: a.shareWith,
					permissions: a.permissions
				}, opts);
			});
			return Promise.all(promises);
		},



		// Low Level API
		get: (path, opts) => {return api.call('GET', path, opts);},

		post: (path, data, opts) => {return api.call('POST', path, data, opts);},

		put: (path, data, opts) => {return api.call('PUT', path, data, opts);},

		call: function (method, path, data, requestOptions) {
			calls++;

			var options = Object.assign({
				path: baseOptions.api_path + path,
				method: method
			}, baseOptions);

			options.headers = options.headers || {};
			options.headers['OCS-APIRequest'] = true;

			if ((method === 'PUT' || method === 'POST') && data) {
				options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
			}

			if (requestOptions && requestOptions.auth) {
				options.auth = requestOptions.auth;
			}

			var formdata = querystring.stringify(data);
			options.headers['Content-Length'] = formdata.length;

			// var startTime = +new Date();

			return new Promise(function (fulfill, reject) {
				var req = https.request(options, (res) => {
					var body = '';

					res.on('data', (d) => {
						body += d;
					});

					res.on('end', () => {
						var xmlparser = xml2js.Parser();
						xmlparser.parseString(body, (err, result) => {
							if (err) {
								console.error(body);
								reject(err);
							} else {
								// console.log('   - (%dms) request %s %s', (+new Date() - startTime), options.path, JSON.stringify(data));
								fulfill({request: {method: options.method, path: options.path, data: data}, xml: result});
							}
						});
					});
				});
				if (data) {
					req.write(formdata);
				}

				req.on('error', (e) => {
					console.error(e);
					reject(e);
				});

				req.end();
			});
		}
	};

	return api;
};
