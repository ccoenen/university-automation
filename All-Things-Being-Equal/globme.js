/*eslint no-console: 0 */
const statSync = require('fs').statSync;
const path = require('path');

const glob = require('glob');

const compare = require('./structural-comparison');
const fileInfo = require('./fileinfo');

// var workdir = 'C:/tmp-scratchpad/**/*.js';
var nameRegex = /Abgaben\/(\D+)_\d/; // first match group is the identifying name.
var excludePatterns = [
	/jquery[-.]/i,
	/example-/i,
	/min.*\.js$/i,
	/p5\.?setup\.js$/i,
	/p5\.sound\.js$/i,
	/bootstrap/i,
	/node_modules/i,
];

var js = glob.sync(workdir);
js = js.filter(function (name) {
	if (statSync(name).isDirectory()) {
		return false;
	}

	let include = true;
	excludePatterns.forEach((pattern) => {
		include = include && (!name.match(pattern)); // turns include to false, if any of the patterns match.
	});
	return include;
});

js.sort(function (a, b) {
	var ba = path.basename(a);
	var bb = path.basename(b);
	if (ba > bb) { return 1; }
	if (ba < bb) { return -1; }
	return 0;
});
js.sort();

const jsFileInfos = js.map(name => fileInfo(name, nameRegex));
var jsFileNumber = js.length;

console.log(`<html>
	<head>
		<meta http-equiv='content-type' content='text/html; charset=utf-8'>
		<style>
			table span { display:none; }
			th { writing-mode:vertical-lr; white-space:nowrap; }
			td { white-space:nowrap; }
			tr:hover td { border-width: 1px 0; border-color: black; border-style: solid; }
		</style>
	</head>
	<body>
		<table>
			<tr>`);

jsFileInfos.forEach(function (info) {
	console.log('<th>%s / %s</th>', info.author, info.basename);
});
console.log('<th>Notices</th>');
console.log('</tr>');

jsFileInfos.forEach(function (infoA, index) {
	console.error(infoA.fullPath);

	console.log('<tr>');
	// if (index) console.log('<td colspan=\'%d\'></td>', index);
	let notices = -1;
	for (var i = 0; i < jsFileNumber; i++) {
		var infoB = jsFileInfos[i];
		var diff = compare(infoA, infoB);
		var color = 'inherit';
		if (diff.structuralDifferencesCount < 10) {color = '#ffddcc';}
		if (diff.literalDifferencesCount < 25) {color = '#ff7f00';}
		if (diff.structuralDifferencesCount < 5) {color = '#ffcccc';}
		if (diff.literalDifferencesCount < 10) {color = '#ff0000';}
		if (i === index) {color = '#cccccc';}
		if (color != 'inherit') {
			notices++;
		}

		console.log(`<td style='background-color: ${color}' title='Comparing ${infoA.basename} from ${infoA.author}\nwith ${infoB.basename} from ${infoB.author}:\nS: ${diff.structuralDifferencesCount} / L: ${diff.literalDifferencesCount}\nTokens in A: ${infoA.literalTokens.length} / B: ${infoB.literalTokens.length}'>`);
		console.log('S: %d<br>L: %d', diff.structuralDifferencesCount, diff.literalDifferencesCount);
		console.log('</td>');
	}
	console.log(`<td style="background-color: ${notices > 0 ? 'yellow' : 'inherit'}">${notices}</td>`);
	console.log('<td>%s / %s</td>', infoA.author, infoA.basename);
	console.log('</tr>');
});
console.log('</table></body></html>');
