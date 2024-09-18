const path = require('path');

module.exports = {
  entry: './src/index.js', // Your original JS file
  output: {
    filename: 'bundle.js', // Output bundle file
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  mode: 'production', // Use production mode to minify code
};

