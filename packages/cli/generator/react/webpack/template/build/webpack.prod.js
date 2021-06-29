const webpack = require('webpack');
const webpackCommonConfig = require('./webpack.config.js');
const webpackMerge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const miniCSSExtractPlugin = require('mini-css-extract-plugin');
const optimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');

module.exports = webpackMerge(webpackCommonConfig, {
  mode: 'production',
  devtool: 'none',
  optimization: {
    splitChunks: {
      cacheGroups: {
        // node_modules下的模块拆分到chunk-vendors.xxxx.js下
        vendors: {
          name: 'chunk-vendors',
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: 'all'
        },
        // 自己定义的公告组件超过两次引用的放在chunk-common.xxxx.js下
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'all',
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: true
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: miniCSSExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass')
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: miniCSSExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpackBundleAnalyzer({
      analyzerMode: 'static'
    }),
    new miniCSSExtractPlugin({
      filename: 'css/[name].[hash:4].css',
      chunkFilename: 'css/[name].[hash:4].css'
    }),
    new optimizeCssnanoPlugin({
      sourceMap: true,
      cssnanoOptions: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          }
        }]
      }
    })
  ]
})