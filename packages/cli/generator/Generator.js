const ejs = require('ejs');
const { runTransformation } = require('vue-codemod');

const sortObject = require('../utils/sortObject');
const writeFileTree = require('../utils/writeFileTree');

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
    // 生成的项目目录的入口文件路径
    this.entryFile = 'src/main.js';
    // 模板、配置等文件信息
    this.files = {};
    // 存储生成模板文件的回调函数
    this.fileMiddlewares = [];
    // 需要导入的import语句
    this.imports = {};
    // 需要插入的options语句
    this.rootOptions = {};
  }

  async generate() {
    this.extraConfigToFile();
    await this.resolveFiles();
    this.sortPkg();
    this.files['package.json'] = JSON.stringify(this.pkg, null, 2) + '\n';

    // 将所有内容写入到文件并输出到项目目录
    await writeFileTree(this.context, this.files);
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
        const res = configTransform.transform(value, this.context, this.files);

        const { content, filename } = res;

        this.files[filename] = this.ensureEOF(content);
        delete this.pkg[key];
      }
    };

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
    normaliseFilePaths();

    // 转换imports、options
    Object.keys(files).forEach((file) => {
      let imports = this.imports[file];
      imports = imports instanceof Set ? Array.from(imports) : imports;
      if(imports && imports.length > 0) {
        files[file] = runTransformation(
          { path: file, source: files[file]},
          require('../utils/codemods/injectImports'),
          { imports }
        );
      }

      let injections = this.rootOptions[file];
      injections = injections instanceof Set ? Array.from(injections) : injections;
      if(injections && injections.length > 0) {
        files[file] = runTransformation(
          { path: file, source: files[file]},
          require('../utils/codemods/injectOptions'),
          { injections }
        );
      }
    });
  }

  // 注入import语句
  injectImports(file, imports) {
    const _imports = (
      this.imports[file] || (this.imports[file] = new Set())
    );
    (Array.isArray(_imports) ? imports : [imports]).forEach((imp) => {
      _imports.add(imp);
    });
  }

  // 注入选项（vue-router、vuex在main.js里面的Vue实例化对象时里面的参数）
  injectRootOptions(file, options) {
    const _options = (
      this.rootOptions[file] || (this.rootOptions[file] = new Set())
    );
    (Array.isArray(options) ? options : [options]).forEach((opt) => {
      _options.add(opt);
    });
  }

  // 对package.json的字段进行排序
  sortPkg() {
    this.pkg.dependencies = sortObject(this.pkg.dependencies);
    this.pkg.devDependencies = sortObject(this.pkg.devDependencies);
    this.pkg.scripts = sortObject(this.pkg.scripts, [
      'dev',
      'build',
      'test:unit',
      'test:e2e',
      'lint',
      'deploy',
    ]);

    this.pkg = sortObject(this.pkg, [
      'name',
      'version',
      'private',
      'description',
      'author',
      'scripts',
      'husky',
      'lint-staged',
      'main',
      'module',
      'browser',
      'jsDelivr',
      'unpkg',
      'files',
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'vue',
      'babel',
      'eslintConfig',
      'prettier',
      'postcss',
      'browserslist',
      'jest',
    ]);
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