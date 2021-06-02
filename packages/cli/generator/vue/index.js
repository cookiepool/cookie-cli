module.exports = (generator, options) => {
  generator.render('./template', {
    vueVersion: options.vueVersion
  });
};
