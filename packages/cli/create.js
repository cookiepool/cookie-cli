/***
 * 生成项目的核心文件
 * ***/
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const validateNpmPackageName = require("validate-npm-package-name");

const Creator = require('./promptModules/Creator');
const PromptModuleAPI = require('./promptModules/PromptModuleAPI');
const Generator = require('./generator/Generator');

async function create (name, options) {
  const cwdDir = process.cwd();
  const projectName = name;
  const isPonitName = projectName === '.';

  // 项目名字
  const curProjName = isPonitName ? path.relative('../', cwdDir) : projectName;
  // 项目目标路径
  const targetDir = path.resolve(cwdDir, projectName || '.');

  // 验证项目名是否符合npm包规范
  const results = validateNpmPackageName(curProjName);
  if(results.validForNewPackages === false) {
    console.error(chalk.red(`Invalid project name ${ curProjName }`));

    results.errors && results.errors.forEach((item) => {
      console.log(chalk.red.dim(`Errors: ${ item }`));
    });

    results.warnings && results.warnings.forEach((item) => {
      console.log(chalk.red.dim(`Warnings: ${ item }`));
    });

    process.exit(1);
  }

  // 判断当前新建项目的目录情况
  if(fs.existsSync(targetDir)) {
    // 使用--force命令
    if(options.force) {
      await fs.remove(targetDir);
    } else {
      if(isPonitName) {
        const { ok } = await inquirer.prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: 'Create a new project in current directory?'
          }
        ]);

        if(!ok) {
          return;
        }
      } else {
        // 如果创建的项目跟当前文件夹下的目录同名了
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `Target directory ${ chalk.blueBright(targetDir) } is exited, please select a action!`,
            choices: [
              { name: 'overwrite', value: 'overwrite'},
              { name: 'cancel', value: 'cancel'}
            ]
          }
        ]);       

        if(!action) {
          return;
        } else if(action === 'overwrite') {
          console.log( chalk.red(`Rmoveing ${ targetDir } ......`));
          await fs.remove(targetDir);
        }
      }
    }
  }

  console.log( chalk.blueBright('---------- 检测通过，开始项目生成操作 -----------'));

  // 核心逻辑
  // 获取交互提示语
  const creator = new Creator();
  const promptModules = getPromptModules();
  const promptAPI = new PromptModuleAPI(creator);
  promptModules.forEach((cb) => cb(promptAPI));

  // 获取用户选择
  /***
   * {
        features: [ 'vue', 'webpack', 'babel', 'linter', 'router', 'vuex' ],
        lintcongfig: 'standard',
        lintOn: [ 'save', 'commit' ],
        historyMode: true
      }
   * ***/
  const answers = await inquirer.prompt(creator.getFinalPrompts());
  // vue、webpack暂时默认为必选
  answers.features.unshift('vue', 'webpack');

  const pkg = {
    name,
    version: '0.1.0',
    dependencies: {},
    devDependencies: {}
  };

  const generator = new Generator(pkg, path.join(process.cwd(), name));

  console.log('--- THE END ---');
}

function getPromptModules() {
  return [
    'babel',
    'lint',
    'vue-router',
    'vuex'
  ].map((file) => require(`./promptModules/prompts/${ file }.js`));
}

module.exports = (name, cmd) => {
  return create(name, cmd).catch((err) => {
    console.error(err);
  });
};