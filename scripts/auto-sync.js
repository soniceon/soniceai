const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

// 需要监听的文件
const filesToWatch = [
  path.join(__dirname, '../src/data/aiTools.json'),
  path.join(__dirname, '../src/data/categories.uuid.json'),
  path.join(__dirname, '../src/data/users.json'),
  path.join(__dirname, '../src/data/reviews.json'),
];

let syncing = false;
let pending = false;

function syncToSupabase() {
  if (syncing) {
    pending = true;
    return;
  }
  syncing = true;
  console.log('检测到数据变动，正在同步到 Supabase...');
  exec('node scripts/import-all-to-supabase.js', (err, stdout, stderr) => {
    if (err) {
      console.error('同步失败:', stderr);
    } else {
      console.log('同步成功:', stdout);
    }
    syncing = false;
    if (pending) {
      pending = false;
      syncToSupabase();
    }
  });
}

chokidar.watch(filesToWatch, { ignoreInitial: true }).on('change', (filePath) => {
  console.log(`${filePath} 发生变动，准备同步...`);
  syncToSupabase();
});

console.log('已启动自动同步，监听本地数据文件变动...'); 