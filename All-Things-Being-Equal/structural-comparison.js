var fs = require('fs');
var esprima = require('esprima');
var deep = require('deep-diff');
var berndification = require('./berndification');

module.exports = function compare(a, b) {
  "use strict";

  var tokensA, tokensB;

  tokensA = esprima.tokenize(fs.readFileSync(a, 'utf8'));
  tokensB = esprima.tokenize(fs.readFileSync(b, 'utf8'));

  var literalDifferences = deep(tokensA, tokensB);
  tokensA = tokensA.map(berndification);
  tokensB = tokensB.map(berndification);
  var structuralDifferences = deep(tokensA, tokensB);

  return {
    tokensA: tokensA,
    tokensB: tokensB,
    structuralDifferences: structuralDifferences,
    structuralDifferencesCount: structuralDifferences ? structuralDifferences.length : 0,
    literalDifferences: literalDifferences,
    literalDifferencesCount: literalDifferences ? literalDifferences.length : 0
  };
};
