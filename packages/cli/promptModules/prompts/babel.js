module.exports = (api) => {
  api.injectFeature({
    name: 'Babel',
    value: 'babel',
    description: 'Transpile modern JavaScript to older versions (for compatibility)',
    checked: true
  });
};