const util = require('util')
var compare = require('./structural-comparison');
var filenameA = process.argv[2];
var filenameB = process.argv[3];

if (!filenameA) {
  console.log("Usage: node index.js <fileA> <fileB>");
  process.exit();
}
var diff = compare(filenameA, filenameB);

console.log("Literal Differences: %d / Structural Differences: %d", diff.literalDifferencesCount, diff.structuralDifferencesCount);

if (diff.structuralDifferencesCount < 1 && diff.literalDifferencesCount > 0) {
  diff.literalDifferences.forEach(function (difference) {
    console.log("- %s: %s", difference.added ? "+" : difference.removed ? "-" : " ", difference.value);
  });
}


console.log("--------------A----------");
console.log(util.inspect(diff.tokensAl, {showHidden: false, depth: null, maxArrayLength: null}));
console.log("\n\n--------------B----------");
console.log(util.inspect(diff.tokensBl, {showHidden: false, depth: null, maxArrayLength: null}));
console.log("\n\n------------diff----------")
console.log(util.inspect(diff.structuralDifferences, {showHidden: false, depth: null, maxArrayLength: null}));
