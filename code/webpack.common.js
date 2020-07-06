const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, './src/main.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: /.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
    }, {
      test: /\.(js|vue)$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: [path.resolve('src')],
      options: {
        formatter: require('eslint-friendly-formatter')
      }
    }, {
      test: /\.(png|gif|jpg|svg|jpeg)$/i,
      loader: 'url-loader',
      options: {
        limit: 2048,
        name: 'assets/[name].[ext]',
        esModule: false,
      },
    }, {
      test: /\.(less|css)$/,
      use: [
        'style-loader',
        'css-loader',
        'less-loader',
      ]
    }, {
      test: /.vue$/,
      loader: 'vue-loader'
    }],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'public/index.html',
      title: 'vue-cli',
      favicon: 'public/favicon.ico',
      inject: true,
    }),
  ]
};