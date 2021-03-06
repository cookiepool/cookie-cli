module.exports = (generator, options) => {
  generator.extendPackage({
    dependencies: {
      'react': '^17.0.2',
      'react-dom': '^17.0.2'
    }
  });

  generator.render('./template', {
    buildTool: options.features
  });
};