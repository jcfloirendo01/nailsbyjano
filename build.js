const fs = require('fs');
const url = process.env.SHEETS_API_URL || '';
fs.writeFileSync('config.js', `window.SHEETS_API_URL = "${url}";\n`);
console.log('config.js generated.');
