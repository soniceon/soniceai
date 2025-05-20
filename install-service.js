const Service = require('node-windows').Service;
const path = require('path');

// 创建服务实例
const svc = new Service({
  name: 'SoniceAI',
  description: 'Sonice AI Web Application Service',
  script: path.join(__dirname, 'start-service.js'),
  nodeOptions: [],
  env: {
    name: "NODE_ENV",
    value: "production"
  }
});

// 监听安装事件
svc.on('install', function() {
  console.log('Service installed successfully');
  svc.start();
});

// 监听启动事件
svc.on('start', function() {
  console.log('Service started successfully');
});

// 安装服务
svc.install(); 