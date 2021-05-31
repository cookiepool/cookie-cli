module.exports = (api) => {
  api.injectFeature({
    name: 'Linter / Formater',
    value: 'linter',
    description: 'Check and enforce code quality with ESLint or Prettier',
    checked: true
  });

  api.injectPrompt({
    name: 'eslintConfig',
    when: (answers) => answers.features.includes('linter'),
    type: 'list',
    message: 'Pick a linter / formatter config:',
    description: 'Checking code errors and enforcing an homogeoneous code style is recommended.',
    choices: [
      { 
        name: 'ESLint + Prettier',
        value: 'prettier'
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