const webpack = require('webpack');
const webpackCommonConfig = require('./webpack.config.js');
const merge = require('webpack-merge');
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = merge(webpackCommonConfig, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass')
            }
          }
        ]
      }<%_ if(lintOnSave) { _%>,
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      }
      <%_ } _%>
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new friendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: 127.0.0.1:9200`]
      }
    })
  ],
  devServer: {
    host: '0.0.0.0',
    hot: true,
    port: 9200,
    contentBase: './dist',
    clientLogLevel: "error",
    overlay: {
      errors: true,
      warnings: true
    },
    quiet: true
  }
});