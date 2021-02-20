const pathBasename = require('path').basename;
const readFileSync = require('fs').readFileSync;

const esprima = require('esprima');

const berndification = require('./berndification');

module.exports = function fileInfo(fullPath, authorRegex) {
	const basename = pathBasename(fullPath);
	const author = authorRegex ? fullPath.match(authorRegex) : '';
	const content = readFileSync(fullPath, 'utf8');

    const tokens = esprima.tokenize(content);
    const literalTokens = JSON.parse(JSON.stringify(tokens)).map(JSON.stringify);
    const structuralTokens = JSON.parse(JSON.stringify(tokens)).map(berndification).filter(Boolean).map(JSON.stringify);

    return {
		fullPath,
		author: author ? author[1] : 'unknown',
		basename,
		content,
        tokens,
        literalTokens,
        structuralTokens
	};
};
