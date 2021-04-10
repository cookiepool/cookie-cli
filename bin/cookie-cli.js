const chalk = require('chalk');
const semver = require('semver');

/**********************************
 * 1、检测用户安装的Node.js版本
 * ********************************/
// 引入要求的Node.js版本
const requiredNodeVer = require('../package.json').engines.node;

// 封装一个检测版本的函数
function checkNodeVersion(requiredVer, projName) {
  if(!semver.satisfies(process.version, requiredVer, { includePrerelease: true})) {
    console.log(chalk.red(`You are using Node ${ process.version }, but this version of '${ projName }
    requires Node ${ requiredVer }.
    Please upgrade your Node version.`));

    // 结束进程
    process.exit(1);
  }
}


// 检测版本
checkNodeVersion(requiredNodeVer, 'cookie-cli');


/**********************************
 * 2、如果用户使用的即将失去维护的版本，提示用户
 * ********************************/
const ENDOFLIFE_NODE = ['13.x'];
for(let ver of ENDOFLIFE_NODE) {
  if(semver.satisfies(process.version, ver)) {
    console.log(chalk.red(
      `You are using Node ${process.version}.\n` +
      `Node.js ${ver} has already reached end-of-life and will not be supported in future major releases.\n` +
      `It's strongly recommended to use an active LTS version instead.`
    ));
  }
}

// 核心代码
const { program } = require('commander');
const minimist = require('minimist');

program.version(`cookie-cli ${require('../package.json').version}`);

// 定义create命令
program.command('create <project-name>')
  .description('create a new project by cookie-cli')
  .action((name) => {
    // 多写参数给出警告
    if(minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow(`\n Info: You provided more than one argument. 
        The first one will be used as the app\'s name, the rest are ignored.`));
    }

    require('../packages/cli/create-command/create')(name);
  });
  
program.parse(process.argv);