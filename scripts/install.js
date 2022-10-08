var fs = require('fs');
var dir = './python';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
