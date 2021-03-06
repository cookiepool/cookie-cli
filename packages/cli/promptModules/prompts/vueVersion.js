module.exports = (api) => {
  api.injectFeature({
    name: 'Choose Vue version',
    value: 'vueVersion',
    description: 'Choose a version of Vue.js that you want to start the project with',
    checked: true
  });

  api.injectPrompt({
    name: 'vueVersion',
    when: (answers) => answers.features.includes('vueVersion'),
    message: 'Choose a version of Vue.js that you want to start the project with',
    type: 'list',
    choices: [
      {
        name: '2.x',
        value: '2'
      },
      {
        name: '3.x',
        value: '3'
      }
    ],
    default: '2'
  });
};