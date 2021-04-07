/***
 * 加载默认和本地保存的选项
 * ***/
const os = require('os');
const fs = require('fs');
const path = require('path');

function getPresetFilePath(fileName) {
  return path.join(os.homedir(), fileName);
}

exports.defaultPreset = {
  useConfigFile: false,
  cssPreprocessor: false,
  plugins: {
    '@vue/cli-plugin-babel': {},
    '@vue/cli-plugin-eslint': {
      base: 'base',
      lintOn: ['save']
    }
  }
};

exports.defaults = {
  lastChecked: undefined,
  lastVersion: undefined,
  packageManager: undefined,
  useTaobaoRegistry: undefined,
  presets: {
    'default': Object.assign({ vueVersion: '2'}, exports.defaultPreset),
    '__default_vue_3__': Object.assign({ vueVersion: '3' }, exports.defaultPreset)
  }
};

exports.loadLocalSavedPreset = () => {
  let presetPath = getPresetFilePath('.vuerc');
  let options;

  if(fs.existsSync(presetPath)) {
    try {
      options = JSON.parse(fs.readFileSync(presetPath, 'utf-8'));
    } catch(err) {
      console.error(
        `Error loading saved preferences: ` +
        `~/.vuerc may be corrupted or have syntax errors. ` +
        `Please fix/delete it and re-run vue-cli in manual mode.\n` +
        `(${err.message})`
      );
      process.exit(1);
    }
    return options;
  } else {
    return {};
  } 
};