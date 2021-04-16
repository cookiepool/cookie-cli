module.exports = (api) => {
  api.injectFeature({
    name: 'Router',
    value: 'router',
    description: 'Router config'
  });

  api.injectPrompt({
    name: 'historyMode',
    when: (answers) => answers.features.includes('router'),
    type: 'confirm',
    message: 'Use histroy mode for router'
  });
};