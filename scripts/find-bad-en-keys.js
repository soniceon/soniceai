const fs = require('fs');
const path = require('path');
const enFile = path.join(__dirname, '../public/locales/en/common.json');
const json = JSON.parse(fs.readFileSync(enFile, 'utf8'));
const badKeys = [];
for (const key in json) {
  if (json[key] === '' || json[key] === key) {
    badKeys.push(key);
  }
}
console.log('需要补全英文内容的 key：\n', badKeys.join('\n')); 