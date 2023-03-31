const path = require('path');

module.exports = {
  entry: './dist/index.js',
  mode: 'production',
  output: {
    filename: 'lib.js',
    path: __dirname,
  },
};
