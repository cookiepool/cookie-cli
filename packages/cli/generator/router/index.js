module.exports = (generator, options = {}) => {
  generator.injectImports(generator.entryFile, `import router from './router'`);

  generator.injectRootOptions(generator.entryFile, `router`);

  let routerConfig;
  if(options.vueVersion === '3') {
    routerConfig = {
      dependencies: {
        'vue-router': '^4.0.8',
      }
    };
  } else {
    routerConfig = {
      dependencies: {
        'vue-router': '^3.2.0',
      }
    };
  }

  generator.extendPackage(routerConfig);

  generator.render('./template', {
    historyMode: options.historyMode,
    vueVersion: options.vueVersion
  });
};
