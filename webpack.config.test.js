/*global require,module,__dirname*/
const path = require('path')
module.exports = {
  entry: './test/test.js',
  output: {
    filename: 'test.min.js',
    path: path.resolve(__dirname, 'test')
  },
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0', 'minify']
        }
      }
    ]
  }
}