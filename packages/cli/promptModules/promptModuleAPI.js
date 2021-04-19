module.exports = class PromptModuleAPI {
  constructor(creator) {
    this.creator = creator;
  }

  injectFeature(feature) {
    this.creator.injectFeature.choices.push(feature);
  }

  injectPrompt(prompt) {
    this.creator.injectedPrompts.push(prompt);
  }
};