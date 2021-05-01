const { readFileSync } = require('fs');
const Parser = require('srt-parser-2').default;

const parser = new Parser();
const content = readFileSync(process.argv[2]).toString();
const srt = parser.fromSrt(content);

srt.forEach((item) => {
	let timestamp = item.startTime.split(',')[0]; // no ms.
	let timestampParts = timestamp.split(':');
	let seconds = parseInt(timestampParts[0], 10) * 3600 + parseInt(timestampParts[1], 10) * 60 + parseInt(timestampParts[2], 10);
	if (timestampParts[0] === '00') {
		// remove leading zeros if there's no hour at all.
		timestamp = timestamp.substr(3);
	}
	// /play/<videoId>?startTime=0
	console.log(`* [${timestamp}: ${item.text}](/play/515?startTime=${seconds})`);
});
