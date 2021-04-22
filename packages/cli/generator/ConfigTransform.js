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
  }

  // 获取提取出来的文件类型和文件名
  getDefaultFileInfo() {
    const [ type ] = Object.keys(this.fileTypes);
    const [ filename ] = this.fileTypes[type];
    return { type, filename };
  }
}

module.exports = ConfigTransform;