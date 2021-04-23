const transforms = require('../utils/configTransforms');

class ConfigTransform {
  constructor(fileOptions) {
    this.fileTypes = fileOptions.file;
  }

  transform(value, context) {
    let file;
    if(!file) {
      file = this.getDefaultFileInfo();
    }

    const { type, filename } = file;

    const transform = transforms[type];

    const content = transform.write({
      value,
      filename,
      context
    });

    return { 
      filename,
      content
    };
  }

  // 获取提取出来的文件类型和文件名
  getDefaultFileInfo() {
    const [ type ] = Object.keys(this.fileTypes);
    const [ filename ] = this.fileTypes[type];
    return { type, filename };
  }
}

module.exports = ConfigTransform;