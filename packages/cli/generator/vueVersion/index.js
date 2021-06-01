module.exports = (generator, options = {}) => {
  let vueVersionConfig;
  if(options.vueVersion === '3') {
    vueVersionConfig = {
      dependencies: {
        'vue': '^3.0.11'
      },
      devDependencies: {
        '@vue/compiler-sfc': '^3.0.11',
        'vue-loader': '^16.2.0'
      }
    };
  } else {
    vueVersionConfig = {
      dependencies: {
        'vue': '^2.6.11'
      },
      devDependencies: {
        'vue-template-compiler': '^2.6.12',
        'vue-loader': '^15.7.2'
      }
    };
  }

  generator.extendPackage(vueVersionConfig);
};