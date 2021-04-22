module.exports = (api) => {
  api.injectFeature({
    name: 'Linter / Formater',
    value: 'linter',
    description: 'Linter / Formater config',
    checked: true
  });

  api.injectPrompt({
    name: 'eslintConfig',
    when: (answers) => answers.features.includes('linter'),
    type: 'list',
    message: 'Pick a congfig type',
    description: 'ESLint config',
    choices: [
      { 
        name: 'ESLint + Airbnb config',
        value: 'airbnb'
      },
      { 
        name: 'ESLint + Standard config',
        value: 'standard'
      }
    ]
  });

  api.injectPrompt({
    name: 'lintOn',
    message: 'Pick additional lint features:',
    when: answers => answers.features.includes('linter'),
    type: 'checkbox',
    choices: [
      {
        name: 'Lint on save',
        value: 'save',
        checked: true,
      },
      {
        name: 'Lint and fix on commit',
        value: 'commit',
      },
    ]
  });
};