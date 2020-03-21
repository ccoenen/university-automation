const fs = require('fs');

const reader = require('./lib/reader');

const filename = process.argv[2];
console.log(`Reading file ${filename}`);
const data = reader.parse(fs.readFileSync(filename, 'UTF-8'));
console.log(data);
