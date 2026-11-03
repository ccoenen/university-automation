import XLSX from "xlsx";
import { Command } from 'commander';

// Parameter parsing
const program = new Command();
program
	.name("the assignator")
	.description("Assign people to other people");

program
	.option("-p, --print-columns <columns>", "which column to print (comma separated)")
	.option("-m, --must-have <column>", "filters the list by lines that must have a certain column set`")
	.argument("<listfile>", "spreadsheet containing the names");

program.parse();
const options = program.opts();

console.log(options);



// Spreadsheet to workable JSON
const source = XLSX.readFile(program.args[0]);
if (source.Sheets.length > 0) {
	console.warn(`${this.filename} contains multiple worksheets. Using only ${source.SheetNames[0]}!`);
}
const sheet = source.Sheets[source.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet, {raw: false});



// Processing
const allLines = data.filter(line => {
	if (options.mustHave) {
		return line[options.mustHave];
	} else {
		return line;
	}
});
const outputLines = [];

for (const line of data) {
	console.log(`finding ${options.printColumns} for ${Object.values(line).splice(0,3).join(";")}`);
	if (allLines.length > 0) {
		let randomIndex;
		let retriesLeft = 3; // to break out of here in case of problems
		do {
			retriesLeft--;
			randomIndex = Math.floor(Math.random() * allLines.length);
		} while (line === allLines[randomIndex] && retriesLeft > 0);
		if (!retriesLeft) {
			console.error("could not find a solution");
			process.exit(1);
		}
		outputLines.push(allLines.splice(randomIndex, 1)[0]);
	} else {
		console.warn("no more items to assign!");
	}
}



// Output
console.log("\n\n# Result");
const printColumns = options.printColumns.split(",");
for (const line of outputLines) {
	let outputLine = [];
	for (const c of printColumns) {
		outputLine.push(line[c]);
	}
	console.log(outputLine.join(";"));
}
