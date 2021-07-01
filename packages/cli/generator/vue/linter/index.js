const map = {
  prettier: {
    'prettier': '^2.3.0',
    'eslint-config-prettier': '^8.3.0',
    'eslint-plugin-prettier': '^3.4.0',
  }
};
    
module.exports = (generator, { lintOn, eslintConfig, features, vueVersion }) => {
  generator.render('./template', {
    webpack: features.includes('webpack'),
    vueVersion: vueVersion
  });

  generator.extendPackage({
    scripts: {
      'lint': 'eslint --ext .js,.vue src',
      'lint:fix': 'eslint --fix *.js **/*.js **/*.vue',
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
      'husky': {
        'hooks': {
          'pre-commit': 'lint-staged'
        }
      },
      'lint-staged': {
        '*.{js,vue}': 'eslint'
      }
    });
  }

  if (lintOn.includes('save') && features.includes('webpack')) {
    generator.extendPackage({
      devDependencies: {
        'eslint-loader': '^4.0.2',
        'eslint-friendly-formatter': '^4.0.1'
      }
    });
  } else if(lintOn.includes('save') && features.includes('vite')) {
    generator.extendPackage({
      devDependencies: {
        'vite-plugin-eslint': '^1.1.3',
      }
    });
  }
};
