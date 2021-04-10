const path = require('path');
const chalk = require('chalk');

const validateNpmPackageName = require("validate-npm-package-name");

async function create(name) {
  const cwdDir = process.cwd();
  const projectName = name;
  const isPonitName = projectName === '.';

  // 项目名字
  const curProjName = isPonitName ? path.relative('../', cwdDir) : projectName;
  // 项目目标路径
  const targetDir = path.relative(cwdDir, projectName || '.');

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

  console.log('----------here-----------')
}

module.exports = (name) => {
  return create(name).catch((err) => {
    console.error(err);
  });
}