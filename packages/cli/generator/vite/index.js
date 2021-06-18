module.exports = (generator, options = {}, projectName) => {
  let vitePlugin;
  if(options.vueVersion === '2') {
    vitePlugin = {
      "vite-plugin-vue2": "^1.6.2"
    };
  }
  if(options.vueVersion === '3') {
    vitePlugin = {
      "@vitejs/plugin-vue": "^1.2.2",
    };
  }

  generator.extendPackage({
    scripts: {
      "dev": "vite --host",
      "build": "vite build",
      "serve": "vite preview"
    },
    devDependencies: {
      "vite": "^2.3.3",
      ...vitePlugin
    },
  });

  generator.render('./template', {
    vueVersion: options.vueVersion,
    projectName: projectName || 'Default App Name'
  });
};
