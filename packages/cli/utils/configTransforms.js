const stringifyJS = require('./stringifyJS');

const transformJS = {
  read: ({ filename, context }) => {
    try {
      // context true会被忽略掉
      return require(`./${ filename }`, context, true);
    } catch (e) {
      return null;
    }
  },
  write: ({ value }) => `module.exports = ${ stringifyJS(value, null, 2) }`
};

module.exports = {
  js: transformJS
};