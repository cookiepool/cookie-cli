module.exports = (generator) => {
  generator.extendPackage({
    babel: {
      presets: [
        '@babel/preset-react',
        ['@babel/preset-env', {
          'useBuiltIns': 'usage',
          'corejs': 3
        }]
      ]
    },
    dependencies: {
      'core-js': '^3.15.0',
    },
    devDependencies: {
      '@babel/core': '^7.14.6',
      '@babel/preset-env': '^7.14.7',
      '@babel/preset-react': '^7.14.5',
      'babel-loader': '^8.2.2',
    },
    browserslist: [
      '> 1%',
      'last 2 versions',
      'not dead',
    ]
  });
};
