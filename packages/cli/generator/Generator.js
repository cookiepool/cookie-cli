const ejs = require('ejs');
const { runTransformation } = require('vue-codemod');

const ConfigTransform = require('./ConfigTransform');
/***
 * 用于模板生成
 * ***/
const defaultConfigTransforms = {
  babel: new ConfigTransform({
    file: {
      js: ['babel.config.js']
    }
  }),
  postcss: new ConfigTransform({
    file: {
      js: ['postcss.config.js']
    }
  }),
  eslintConfig: new ConfigTransform({
    file: {
      js: ['.eslintrc.js']
    }
  }),
  browserslist: new ConfigTransform({
    file: {
      lines: ['.browserslistrc']
    }
  })
};

class Generator {
  constructor(pkg, context) {
    // 包含package.json的信息
    this.pkg = pkg;
    // 项目路径
    this.context = context;
    // 模板、配置等文件信息
    this.files = {};
    this.fileMiddlewares = [];
    // 需要导入的import语句
    this.imports = {};
    // 需要插入的options语句
    this.rootOptions = {};
  }

  async generate() {
    
  }
  
  // 将generator文件夹里面提供的模板的相关package.json
  // 信息注入到生成的项目的package.json文件里面
  extendPackage(packageParams) {
    const pkg = this.pkg;
    for(let key in packageParams) {
      const val = packageParams[key];
      const existed = pkg[key];
      if(isObject(val) && (key === 'scripts' || key === 'dependencies' || key === 'devDependencies')) {
        pkg[key] = Object.assign(existed || {}, val);
      } else {
        pkg[key] = val;
      }
    }
  }

  // babel、postcss这些工具的配置可以单独的配置成独立的文件放在项目的根目录
  extraConfigToFile() {
    const configTransforms = {
      ...defaultConfigTransforms
    };

    const extract = (key) => {
      if(configTransforms[key] && this.pkg[key]) {
        const value = this.pkg[key];
        const configTransform = configTransforms[key];
        const res = configTransform.transform(value, this.context, this.files)

        const { content, filename } = res;

        this.files[filename] = this.ensureEOF(content);
        delete this.pkg[key];
      }
    }

    extract('babel');
  }

  // 解析模板文件
  resolveFiles() {
    // files是一个对象
    const files = this.files;
    for(let middleware of this.fileMiddlewares) {
      middleware(files, ejs.render);
    }

    // 将反斜杠转换为正斜杠，针对Windows
    normaliseFilePaths()

    // 转换imports、options
    Object.keys(files).forEach((file) => {
      let imports = this.imports[file];
      imports = imports instanceof Set ? Array.from(imports) : imports
      if(imports && imports.length > 0) {
        files[file] = runTransformation(
          { path: file, source: files[file]},
          require('../utils/codemods/injectImports'),
          { imports }
        )
      }

      let injections = this.rootOptions[file];
      injections = injections instanceof Set ? Array.from(injections) : injections;
      if(injections && injections.length > 0) {
        files[file] = runTransformation(
          { path: file, source: files[file]},
          require('../utils/codemods/injectOptions'),
          { injections }
        )
      }
    });
  }

  isObject(val) {
    return val && typeof val === 'object';
  }

  ensureEOF(content) {
    if(content.charAt(content.length - 1) !== '\n') {
      return content + '\n';
    }
    
    return content;
  }
}

module.exports = Generator;