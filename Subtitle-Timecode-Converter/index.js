const { readFileSync } = require('fs');
const Parser = require('srt-parser-2').default;

const parser = new Parser();
const content = readFileSync(process.argv[2]).toString();
const srt = parser.fromSrt(content);
const offset = 0; // in case your srt file and video clip don't match up exactly.
function template(data) {
	return `* [${data.printedTimestamp}: ${data.text}](/play/<id>?startTime=${data.seconds})`;
}

srt.forEach((item) => {
	let timestamp = item.startTime.split(',')[0]; // no ms.
	let timestampParts = timestamp.split(':');
	let seconds = parseInt(timestampParts[0], 10) * 3600 + parseInt(timestampParts[1], 10) * 60 + parseInt(timestampParts[2], 10);
	seconds -= offset;
	if (timestampParts[0] === '00') {
		// remove leading zeros if there's no hour at all.
		timestamp = timestamp.substr(3);
	}
	// /play/<videoId>?startTime=0
	let printedTimestamp = offset === 0 ? timestamp : seconds;
	console.log(template({
		printedTimestamp,
		text:item.text,
		seconds
	}));
});
