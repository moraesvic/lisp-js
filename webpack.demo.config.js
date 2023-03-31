const path = require('path');

module.exports = {
  entry: './dist/demo.js',
  mode: 'production',
  output: {
    filename: 'demo.js',
    path: __dirname,
  },
};
