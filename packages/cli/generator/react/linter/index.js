const map = {
  prettier: {
    'prettier': '^2.3.1',
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
      'lint': 'eslint --ext .js,.jsx src',
      'lint:fix': 'eslint --fix --ext .js,.jsx src',
    },
    devDependencies: {
      'eslint': '^7.29.0',
      'eslint-plugin-react': '^7.24.0',
      'eslint-plugin-react-hooks': '^4.2.0',
      ...map[eslintConfig]
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
        '*.{js,jsx}': 'eslint'
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
