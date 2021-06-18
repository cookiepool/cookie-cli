const map = {
  prettier: {
    'prettier': '^2.3.0',
    'eslint-config-prettier': '^8.3.0',
    'eslint-plugin-prettier': '^3.4.0',
  }
};

module.exports = (generator, { lintOn, eslintConfig, features }) => {
  generator.render('./template', {
    webpack: features.includes('webpack')
  });

  generator.extendPackage({
    scripts: {
      'lint': 'eslint --ext .js,.vue src',
      'lint:fix': 'eslint --fix --ext .js,.vue src',
    },
    devDependencies: {
      'eslint': '^7.26.0',
      'eslint-plugin-vue': '^7.6.0',
      ...map[eslintConfig],
    },
  });

  if(features.includes('webpack')) {
    generator.extendPackage({
      devDependencies: {
        'babel-eslint': '^10.0.3'
      }
    });
  }

  if (lintOn.includes('commit')) {
    generator.extendPackage({
      devDependencies: {
        'husky': '^4.3.8',
        'lint-staged': '^9.5.0',
      },
      'lint-staged': {
        '*.{js,vue}': 'eslint'
      }
    });
  }

  if (lintOn.includes('save')) {
    generator.extendPackage({
      devDependencies: {
        'eslint-loader': '^4.0.2',
      }
    });
  }
};
