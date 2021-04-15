module.exports = class Creator {
  constructor() {
    this.injectFeature = {
      name: 'features',
      message: 'Select the features',
      type: 'checkbox',
      pageSize: 8,
      choices: []
    };

    this.injectedPrompts = [];
  }

  getFinalPrompts() {
    this.injectedPrompts.forEach((prompt) => {
      const originalWhen = prompt.when || (() => true);
      prompt.when = (answers) => originalWhen(answers);
    });

    const finalPrompts = [
      this.injectFeature,
      ...this.injectedPrompts
    ];

    return finalPrompts;
  }
};
