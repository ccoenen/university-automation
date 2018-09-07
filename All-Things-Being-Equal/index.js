var compare = require('./structural-comparison');
var filenameA = process.argv[2];
var filenameB = process.argv[3];

if (!filenameA) {
  console.log("Usage: node index.js <fileA> <fileB>");
  process.exit();
}
var diff = compare(filenameA, filenameB);

console.log("Literal Differences: %d / Structural Differences: %d", diff.literalDifferencesCount, diff.structuralDifferencesCount);

if (diff.structuralDifferencesCount < 1) {
  diff.literalDifferences.forEach(function (difference) {
    console.log("- %s: %s\t%s", difference.kind, difference.lhs, difference.rhs);
  });
}
