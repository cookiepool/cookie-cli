module.exports = (generator, options = {}, projectName) => {
  generator.extendPackage({
    scripts: {
      'dev': 'webpack-dev-server --config ./build/webpack.dev.js --progress',
      'build': 'webpack --config ./build/webpack.prod.js --progress',
    },
    devDependencies: {
      '@intervolga/optimize-cssnano-plugin': '^1.0.6',
      'clean-webpack-plugin': '^3.0.0',
      'copy-webpack-plugin': '^5.1.2',
      'css-loader': '^3.4.2',
      'dart-sass': '^1.25.0',
      'file-loader': '^5.0.2',
      'friendly-errors-webpack-plugin': '^1.7.0',
      'html-webpack-plugin': '^3.2.0',
      'mini-css-extract-plugin': '^0.9.0',
      'sass-loader': '^8.0.2',
      'style-loader': '^1.1.3',
      'url-loader': '^3.0.0',
      'webpack': '^4.41.5',
      'webpack-bundle-analyzer': '^3.6.0',
      'webpack-cli': '^3.3.10',
      'webpack-dev-server': '^3.10.3',
      'webpack-merge': '^4.2.2'
    },
  });

  generator.render('./template', {
    hasBabel: options.features && options.features.includes('babel'),
    lintOnSave: options.lintOn && options.lintOn.includes('save'),
    projectName: projectName || 'Default App Name'
  });
};
