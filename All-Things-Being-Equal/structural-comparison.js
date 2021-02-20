var jsdiff = require('diff');

module.exports = function compare(infoA, infoB) {
  "use strict";

  // clone deep, diff.
  var literalDifferences = jsdiff.diffArrays(infoA.literalTokens, infoB.literalTokens);
    var literalLinesCount = literalDifferences.reduce((sum, hunk) => {
    return sum + ((hunk.added || hunk.removed) ? hunk.value.length : 0);
  }, 0);

  // clone deep, run through berndification, filter falsy values.
  var structuralDifferences = jsdiff.diffArrays(infoA.structuralTokens, infoB.structuralTokens);
  var structuralLinesCount = structuralDifferences.reduce((sum, hunk) => {
    return sum + ((hunk.added || hunk.removed) ? hunk.value.length : 0);
  }, 0);

  return {
    structuralDifferences: structuralDifferences,
    structuralDifferencesCount: structuralLinesCount,
    literalDifferences: literalDifferences,
    literalDifferencesCount: literalLinesCount
  };
};
