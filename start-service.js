const { spawn } = require('child_process');
const path = require('path');

// 获取项目根目录
const rootDir = __dirname;

// 启动服务
const startService = () => {
  console.log('Starting Sonice AI service...');
  
  // 使用 npm start 命令启动服务
  const service = spawn('npm', ['start'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true
  });

  service.on('error', (err) => {
    console.error('Failed to start service:', err);
  });

  service.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Service exited with code ${code}`);
      // 如果服务异常退出，尝试重新启动
      setTimeout(startService, 5000);
    }
  });
};

// 启动服务
startService(); 