const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './public/dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
    
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: path.resolve(__dirname, './public/index.html')})
  ],
  mode: 'production',
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 8000
  }  
}