const Service = require('node-windows').Service;
const path = require('path');

// 创建服务实例
const svc = new Service({
  name: 'SoniceAI',
  script: path.join(__dirname, 'start-service.js')
});

// 监听卸载事件
svc.on('uninstall', function() {
  console.log('Service uninstalled successfully');
});

// 卸载服务
svc.uninstall(); 