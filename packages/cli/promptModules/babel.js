modules.exports = (api) => {
  api.injectFeature({
    name: 'babel',
    value: 'babel',
    description: 'Babel config',
    checked: true
  });
};