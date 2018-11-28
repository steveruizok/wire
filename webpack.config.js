const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: './src/Wire.ts',
	mode: 'production',
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
	module: {
		rules: [{
			test: /\.tsx?$/,
			loader: 'awesome-typescript-loader',
			exclude: /node_modules/
		}]
	}
}