const fs = require('fs');
let svg = fs.readFileSync('cannabis.svg', 'utf8');
svg = svg.replace(/fill="#[0-9a-fA-F]+"/, 'fill="#34D399"');
fs.writeFileSync('src/app/icon.svg', svg);
try {
  fs.unlinkSync('src/app/favicon.ico');
} catch (e) {
  // Ignore
}
