const path = require('path');

const htmlWebpackPlugin = require('html-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: path.resolve(__dirname, '../src/index.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[hash:4].js',
    chunkFilename: 'js/[name].[hash:4].js',
    publicPath: '/' 
  },
  module: {
    rules: [
      {
        test: /\jsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader'
        }]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 5120,
            esModule: false,
            fallback: 'file-loader',
            name: 'images/[name].[hash:4].[ext]'
          }
        }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 5120,
            esModule: false,
            fallback: 'file-loader',
            name: 'media/[name].[hash:4].[ext]'
          }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 5120,
            esModule: false,
            fallback: 'file-loader',
            name: 'fonts/[name].[hash:4].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      title: 'React Template',
      template: path.resolve(__dirname, '../public/index.html'),
      filename: path.resolve(__dirname, '../dist/index.html')
    }),
    new copyWebpackPlugin([{
      from: path.resolve(__dirname, '../public'),
      to: path.resolve(__dirname, '../dist')
    }])
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    },
    extensions: ['*', '.js', '.jsx']
  }
}