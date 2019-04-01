var fs = require('fs');
var esprima = require('esprima');
var deep = require('deep-diff');
var jsdiff = require('diff');
var berndification = require('./berndification');

module.exports = function compare(a, b) {
  "use strict";

  var tokensA = esprima.tokenize(fs.readFileSync(a, 'utf8'));
  var tokensB = esprima.tokenize(fs.readFileSync(b, 'utf8'));

  // clone deep, diff.
  var tokensAl = JSON.parse(JSON.stringify(tokensA)).map(JSON.stringify);
  var tokensBl = JSON.parse(JSON.stringify(tokensB)).map(JSON.stringify);
  var literalDifferences = jsdiff.diffArrays(tokensAl, tokensBl);
  var literalLinesCount = literalDifferences.reduce((sum, hunk) => {
    return sum + ((hunk.added || hunk.removed) ? hunk.value.length : 0);
  }, 0);

  // clone deep, run through berndification, filter falsy values.
  var tokensAs = JSON.parse(JSON.stringify(tokensA)).map(berndification).filter(Boolean).map(JSON.stringify);
  var tokensBs = JSON.parse(JSON.stringify(tokensB)).map(berndification).filter(Boolean).map(JSON.stringify);
  var structuralDifferences = jsdiff.diffArrays(tokensAs, tokensBs);
  var structuralLinesCount = structuralDifferences.reduce((sum, hunk) => {
    return sum + ((hunk.added || hunk.removed) ? hunk.value.length : 0);
  }, 0);

  return {
    tokensAl: tokensAl,
    tokensBl: tokensBl,
    tokensAs: tokensAs,
    tokensBs: tokensBs,
    structuralDifferences: structuralDifferences,
    structuralDifferencesCount: structuralLinesCount,
    literalDifferences: literalDifferences,
    literalDifferencesCount: literalLinesCount
  };
};
