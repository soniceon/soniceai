const fs = require('fs');
const path = require('path');

const langs = ['en', 'zh', 'ja', 'ko', 'de', 'fr', 'es', 'ru'];
const baseDir = path.join(__dirname, '../public/locales');

// 删除多余目录下的 common.json
fs.readdirSync(baseDir).forEach(dir => {
  const dirPath = path.join(baseDir, dir);
  if (fs.statSync(dirPath).isDirectory()) {
    if (!langs.includes(dir)) {
      const file = path.join(dirPath, 'common.json');
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`已删除多余目录 ${dir} 下的 common.json`);
      }
    } else {
      // 只保留 common.json，删除其它 json 文件
      fs.readdirSync(dirPath).forEach(f => {
        if (f.endsWith('.json') && f !== 'common.json') {
          fs.unlinkSync(path.join(dirPath, f));
          console.log(`已删除 ${dir} 下多余的 ${f}`);
        }
      });
    }
  }
});
console.log('多余 common.json 已自动删除，只保留 en/zh/ja/ko/de/fr/es/ru 下的 common.json'); 