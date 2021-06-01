module.exports = (generator) => {
  generator.extendPackage({
    babel: {
      presets: [
        ["@babel/preset-env", {
          "useBuiltIns": "usage",
          "corejs": 3
        }]
      ],
    },
    dependencies: {
      'core-js': '^3.6.5',
    },
    devDependencies: {
      '@babel/core': '^7.7.5',
      '@babel/preset-env': '^7.7.5',
      '@babel/plugin-syntax-dynamic-import': '^7.7.4',
      'babel-loader': '^8.0.6',
    },
  });
};
