module.exports = (generator, options = {}, projectName) => {
  generator.extendPackage({
    scripts: {
      'dev': 'vite --host',
      'build': 'vite build',
      'serve': 'vite preview'
    },
    devDependencies: {
      'vite': '^2.3.3',
      '@vitejs/plugin-react-refresh': '^1.3.4',
      'sass': '^1.32.13'
    },
  });

  generator.render('./template', {
    projectName: projectName || 'Default App Name',
    lintOn: options.lintOn
  });
};
