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

const { executeCommand, executeLintCommand } = require('./utils/executeCommand');
const {
  platformPrompts,
  buildToolsPrompts,
  vue_webpack,
  vue_vite,
  react_webpack,
  react_vite
} = require('./utils/prePrompts');

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

  console.log(chalk.blueBright('---------- TEST PASS, START THE PROJECT GENERATION OPERATION-----------'));

  /***
   * 在获取features前，先选择对应的架构和构建工具，根据结果显示指定的
   * ***/
  const preAnswers = await inquirer.prompt([platformPrompts, buildToolsPrompts]);

  // 核心逻辑
  // 获取交互提示语
  const creator = new Creator();
  // 根据preAnswer来选择需要注入的features propmts
  const promptModules = getPromptModules(preAnswers);
  const promptAPI = new PromptModuleAPI(creator);
  promptModules.forEach((cb) => cb(promptAPI));

  // 获取用户选择
  /***
   * 
    {
      features: [
        'vue',
        'webpack',
        'babel',
        'vueVersion',
        'linter',
        'router',
        'vuex'
      ],
      vueVersion: '3',
      eslintConfig: 'prettier',
      lintOn: [ 'save', 'commit' ],
      historyMode: false
    }
   * ***/
  const answers = await inquirer.prompt(creator.getFinalPrompts());
  answers.features.unshift(preAnswers.frame, preAnswers.build);
  console.log(answers);

  const pkg = {
    name,
    version: '0.1.0',
    dependencies: {},
    devDependencies: {}
  };

  const generator = new Generator(pkg, path.join(process.cwd(), name));

  // 选择了vue必须选择版本
  if(answers.features.includes('vue') && !answers.features.includes('vueVersion')) {
    console.log(chalk.red('Vue version must be chosen, please try it again!'));
    process.exit(1);
  }
  // 如果选择了react，则必须默认选择babel，不然无法解析jsx。
  if(answers.features.includes('react') && answers.features.includes('webpack')) {
    answers.features.push('babel');
  }

  answers.features.forEach((feature) => {
    require(`./generator/${ preAnswers.frame }/${ feature }`)(generator, answers, name);
  });
  await generator.generate();

  console.log(chalk.blueBright('---------- START DOWNLOADING PACKAGES ----------'));

  await executeCommand('npm', path.join(process.cwd(), name));

  // 自动生成的模板不符合prettier的格式，需要执行一次lint:fix操作
  if(answers.features.includes('linter')) {
    console.log(chalk.blueBright('---------- FORMATING CODE STYLE ----------'));
    await executeLintCommand('npm', path.join(process.cwd(), name));
  }

  console.log(chalk.blueBright('---------- THE END ----------'));
}

function getPromptModules(preAnswers) {
  const preAnswersStr = preAnswers.frame + '_' + preAnswers.build;

  switch (preAnswersStr) {
  case 'vue_webpack':
    return vue_webpack.map((file) => require(`./promptModules/prompts/${ file }.js`));
  case 'vue_vite':
    return vue_vite.map((file) => require(`./promptModules/prompts/${ file }.js`));
  case 'react_webpack':
    return react_webpack.map((file) => require(`./promptModules/prompts/${ file }.js`));
  case 'react_vite':
    return react_vite.map((file) => require(`./promptModules/prompts/${ file }.js`)); 
  }
}

module.exports = (name, cmd) => {
  return create(name, cmd).catch((err) => {
    console.error(err);
  });
};