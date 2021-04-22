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
    this.pkg = pkg;
    this.context = context;
  }

  async generator() {
    
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

  isObject(val) {
    return val && typeof val === 'object';
  }

  // babel、postcss这些工具的配置可以单独的配置成独立的文件放在项目的根目录
  extraConfigToFile() {}
}

module.exports = Generator;