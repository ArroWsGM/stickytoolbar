const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const pluginName = 'stickytoolbar';

module.exports = {
  entry: {
    'plugin': './src/index.js',
    'plugin.min': './src/index.js'
  },
  output: {
    path: path.join(__dirname, '../dist', pluginName),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../src/LICENSE'),
        to: path.join(__dirname, '../dist', pluginName)
      }
    ])
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.min\.js$/
      })
    ]
  }
};
