const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production', 

  entry: {
    index: './src/index.ts'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, "lib"),
    libraryTarget: 'commonjs2'
  },

  module: {
    rules: [
      {
        test: /\.(tsx|ts)?/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      }
    ]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },

  plugins: [
    new CleanWebpackPlugin()
  ]
}