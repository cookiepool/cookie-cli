module.exports = (generator, options = {}) => {
  // generator.injectImports(generator.entryFile, `import store from './store'`);

  // generator.injectRootOptions(generator.entryFile, `store`);

  let vuexConfig;
  if(options.vueVersion === '3') {
    vuexConfig = {
      dependencies: {
        'vuex': '^4.0.1',
      }
    };
  } else {
    vuexConfig = {
      dependencies: {
        'vuex': '^3.4.0',
      }
    };
  }

  generator.extendPackage(vuexConfig);

  generator.render('./template', {
    vueVersion: options.vueVersion
  });
};
