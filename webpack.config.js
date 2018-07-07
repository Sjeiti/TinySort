/*global require,module,__dirname*/
const path = require('path')
// console.log('asdf',path.join(__dirname, 'dist')) // todo: remove log
module.exports = {
  entry: './doc/js/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'distdoc/js')
  },
	/*entry: {
		main: ['./src/tinysort.js'/!*, './src/tinysort.charorder.js', './src/jquery.tinysort.js'*!/],
		docs: './doc/js/main.js'
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].min.js'
	},*/
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
        // include: path.join(__dirname, 'src/js'),
        // babelrc: false,
        // query: {
        //   presets: ['es2015'],
        //   plugins: [
        //     ["transform-object-rest-spread"],
        //     ["transform-react-display-name"],
        //   ],
        // }
      }
    ]
  }
}