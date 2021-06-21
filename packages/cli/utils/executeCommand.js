const execa = require('execa');

exports.executeCommand = function executeCommand(command, pathName) {
  return new Promise((resolve, reject) => {
    const childProcess = execa(command, ['install'], { 
      cwd: pathName,
      stdio: ['inherit', 'pipe', 'inherit']
    });

    childProcess.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    childProcess.on('close', (code) => {
      if(code !== 0) {
        reject(new Error(`Command executed failed: ${ code }`));
        return;
      }

      resolve();
    });
  });
};

exports.executeLintCommand = function executeLintCommand(command, pathName) {
  return new Promise((resolve, reject) => {
    const childProcess = execa(command, ['run', 'lint:fix'], { 
      cwd: pathName,
      stdio: ['inherit', 'pipe', 'inherit']
    });

    childProcess.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    childProcess.on('close', (code) => {
      if(code !== 0) {
        reject(new Error(`Command executed failed: ${ code }`));
        return;
      }

      resolve();
    });
  });
};