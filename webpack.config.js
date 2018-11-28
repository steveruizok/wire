const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: './src/Wire.ts',
	mode: 'development',
	output: {
		path: path.resolve(__dirname, 'lib'),
		filename: 'wire.js',
		libraryTarget: 'umd',
		library: 'Wire',
		libraryExport: 'default',
		umdNamedDefine: true
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	devtool: 'source-map',
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions:{
					compress:{
						ecma:5
					},
					mangle:{
						'properties': true,
						'keep_fnames': true,
						'keep_classnames': true
					},
					output: {
						comments: false
					}
				}
			})
		]
	},
	module: {
		rules: [{
			test: /\.tsx?$/,
			loader: 'awesome-typescript-loader',
			exclude: /node_modules/
		}]
	}
}