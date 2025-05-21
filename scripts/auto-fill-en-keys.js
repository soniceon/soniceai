const fs = require('fs');
const path = require('path');
const enFile = path.join(__dirname, '../public/locales/en/common.json');
const json = JSON.parse(fs.readFileSync(enFile, 'utf8'));
let changed = false;

function beautifyKey(key) {
  // 替换下划线为空格，分词，首字母大写
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\b([ai])\b/g, c => c.toUpperCase()); // AI大写
}

for (const key in json) {
  if (json[key] === '' || json[key] === key) {
    json[key] = beautifyKey(key);
    changed = true;
    console.log(`Auto-filled: ${key} => ${json[key]}`);
  }
}
if (changed) {
  fs.writeFileSync(enFile, JSON.stringify(json, null, 2), 'utf8');
  console.log('English common.json auto-filled and saved!');
} else {
  console.log('No keys needed to be auto-filled.');
} 