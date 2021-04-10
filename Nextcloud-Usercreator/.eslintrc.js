module.exports = {
	'env': {
		'node': true,
		'es6': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'sourceType': 'module',
		'ecmaVersion': 2017
	},
	'ignorePatterns': ['import 20*'],
	'rules': {
		'no-console': 0
	}
};
