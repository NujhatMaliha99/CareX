const fs = require('fs');
const data = JSON.parse(fs.readFileSync('all-models.json', 'utf16le'));
const names = data.models.map(m => m.name).sort();
console.log(names.join('\n'));
