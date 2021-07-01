module.exports = (generator, options = {}) => {
  // generator.injectImports(generator.entryFile, `import router from './router'`);

  // generator.injectRootOptions(generator.entryFile, `router`);

  generator.extendPackage({
    dependencies: {
      'react-router-dom': '^5.2.0',
      'react-router-config': '^5.1.1'
    },
  });

  generator.render('./template', {
    historyMode: options.historyMode,
    buildTool: options.features
  });
};
