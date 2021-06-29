module.exports = (generator, options) => {
  generator.render('./template', {
    vueVersion: options.vueVersion,
    hasRouter: options.features.includes('router'),
    hasVuex: options.features.includes('vuex')
  });
};
