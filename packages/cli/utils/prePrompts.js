exports.platformPrompts = {
  name: 'frame',
  message: 'Select the frame',
  type: 'list',
  choices: [
    { 
      name: 'Vue',
      value: 'vue'
    },
    { 
      name: 'React',
      value: 'react'
    }
  ]
};

exports.buildToolsPrompts = {
  name: 'build',
  message: 'Select the build tool',
  type: 'list',
  choices: [
    {
      name: 'Webpack',
      value: 'webpack'
    },
    {
      name: 'Vite',
      value: 'vite'
    }
  ]
};

exports.vue_webpack = ['babel', 'vueVersion', 'lint', 'router', 'vuex'];
exports.vue_vite = ['vueVersion', 'lint', 'router', 'vuex'];
exports.react_webpack = ['babel', 'lint', 'router'];
exports.react_vite = ['lint', 'router'];