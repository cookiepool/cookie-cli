const slash = require('slash');

module.exports = function normalizeFilePaths(files) {
  Object.keys(files).forEach((item) => {
    const normalizedKey = slash(item);
    if(normalizedKey !== item) {
      files[normalizedKey] = files[item];
      delete files[item];
    }
  });
};