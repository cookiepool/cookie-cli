const ejs = require('ejs');
const path = require('path');
const globby = require('globby');
const isBinaryFileSync = require('isbinaryfile').isBinaryFileSync;
const fs = require('fs-extra');
// const { runTransformation } = require('vue-codemod');

const sortObject = require('../utils/sortObject');
const writeFileTree = require('../utils/writeFileTree');
const normaliseFilePaths = require('../utils/normalizeFilePaths');

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

/***
 * 用于查找模板的文件路径
 * ***/
function extractCallDir() {
  let stackInfo = {};
  // captureStackTrace是Node.js里面Error类里面的一个方法，依赖于V8的Stack Trace API
  // http://blog.shaochuancs.com/about-error-capturestacktrace/
  Error.captureStackTrace(stackInfo);
  const callFilePath = stackInfo.stack.split('\n')[3];

  // the regexp for the stack when called inside a named function
  const namedStackRegExp = /\s\((.*):\d+:\d+\)$/;
  // the regexp for the stack when called inside an anonymous
  const anonymousStackRegExp = /at (.*):\d+:\d+$/;

  matchResult = callFilePath.match(namedStackRegExp);
  if(!matchResult) {
    matchResult = callFilePath.match(anonymousStackRegExp);
  }


  /***
   * matchResult输出结果大概长这样，下面这个结果是我测试代码的，不是CLI工具的输出
   *  [
        ' (C:\\Users\\cm-lee\\Desktop\\nodejs\\template.js:2:13)',
        'C:\\Users\\cm-lee\\Desktop\\nodejs\\template.js',
        index: 21,
        input: '    at module.exports (C:\\Users\\cm-lee\\Desktop\\nodejs\\template.js:2:13)',
        groups: undefined
      ]
   * ***/
  filePath = matchResult[1];
  return path.dirname(filePath);
}

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

  /***
   * 1、以下函数在generator中调用
   * ***/
  // 1.1、babel、postcss这些工具的配置可以单独的配置成独立的文件放在项目的根目录
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
  ensureEOF(content) {
    if(content.charAt(content.length - 1) !== '\n') {
      return content + '\n';
    }
          
    return content;
  }
  // 1.2、解析模板文件
  async resolveFiles() {
    // files是一个对象
    const files = this.files;
    for(const middleware of this.fileMiddlewares) {
      await middleware(files, ejs.render);
    }

    // 将反斜杠转换为正斜杠，针对Windows
    normaliseFilePaths(files);
  
    // 转换imports、options，这部分暂时不使用注入的方式，先注释
    // Object.keys(files).forEach((file) => {
    //   let imports = this.imports[file];
    //   imports = imports instanceof Set ? Array.from(imports) : imports;
    //   if(imports && imports.length > 0) {
    //     files[file] = runTransformation(
    //       { path: file, source: files[file]},
    //       require('../utils/codemods/injectImports'),
    //       { imports }
    //     );
    //   }
  
    //   let injections = this.rootOptions[file];
    //   injections = injections instanceof Set ? Array.from(injections) : injections;
    //   if(injections && injections.length > 0) {
    //     files[file] = runTransformation(
    //       { path: file, source: files[file]},
    //       require('../utils/codemods/injectOptions'),
    //       { injections }
    //     );
    //   }
    // });
  }
  // 1.3、对package.json的字段进行排序
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
  
  /***
   * 2、以下函数在模板入口文件（generator中各个模板文件）index.js中调用
   * ***/
  // 2.1、用于项目模板渲染
  render(source, additionalOptions, ejsOptions) {
    // 获取模板的父目录路径，也就是generator下面的template文件夹
    const baseDir = extractCallDir();
    source = path.resolve(baseDir, source);
    this.injectFileMiddleware(async (files) => {
      const data = this.resolveOptions(additionalOptions);

      // ['**/*'] 匹配文件以及嵌套的在文件夹里面的文件
      // cwd 指定匹配目录
      // dot 匹配以.开头的文件
      let _files = await globby(['**/*'], { cwd: source, dot: true });
      for(let pathInfo of _files) {
        const sourcePath = path.resolve(source, pathInfo);

        const content = this.renderFile(sourcePath, data, ejsOptions);

        if(Buffer.isBuffer(content) || /[^\s]/.test(content)) {
          files[pathInfo] = content;
        }
      }
    });
  }
  resolveOptions(additionalOptions) {
    return { 
      rootOptions: this.rootOptions,
      ...additionalOptions
    };
  }
  injectFileMiddleware(middleware) {
    this.fileMiddlewares.push(middleware);
  }
  renderFile(name, data, ejsOptions) {
    // 判断是否是二进制文件
    if(isBinaryFileSync(name)) {
      return fs.readFileSync(name);
    }

    const templateContent = fs.readFileSync(name, 'utf8');
    return ejs.render(templateContent, data, ejsOptions);
  }

  // 2.2、将generator文件夹里面提供的模板的相关package.json
  // 信息注入到生成的项目的package.json文件里面
  extendPackage(packageParams) {
    const pkg = this.pkg;
    for(let key in packageParams) {
      const val = packageParams[key];
      const existed = pkg[key];
      if(this.isObject(val) && (key === 'scripts' || key === 'dependencies' || key === 'devDependencies')) {
        pkg[key] = Object.assign(existed || {}, val);
      } else {
        pkg[key] = val;
      }
    }
  }
  isObject(val) {
    return val && typeof val === 'object';
  }

  // 2.3、注入import语句
  injectImports(file, imports) {
    const _imports = (
      this.imports[file] || (this.imports[file] = new Set())
    );
    (Array.isArray(_imports) ? imports : [imports]).forEach((imp) => {
      _imports.add(imp);
    });
  }

  // 2.4、注入选项（vue-router、vuex在main.js里面的Vue实例化对象时里面的参数）
  injectRootOptions(file, options) {
    const _options = (
      this.rootOptions[file] || (this.rootOptions[file] = new Set())
    );
    (Array.isArray(options) ? options : [options]).forEach((opt) => {
      _options.add(opt);
    });
  }
}

module.exports = Generator;