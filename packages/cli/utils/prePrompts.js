exports.platformPrompts = {
  name: 'frame',
  message: 'Select the frame',
  type: 'list',
  choices: [
    'vue',
    'react'
  ]
};

exports.buildToolsPrompts = {
  name: 'build',
  message: 'Select the build tool',
  type: 'list',
  choices: [
    'webpack',
    'vite'
  ]
};

exports.vue_webpack = ['babel', 'lint', 'vue-router', 'vuex'];
exports.vue_vite = ['lint', 'vue-router', 'vuex'];