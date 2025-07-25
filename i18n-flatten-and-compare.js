const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'public', 'locales');
const langs = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());
const fileName = 'common.json';

// 递归平铺对象
function flatten(obj, prefix = '', res = {}) {
  for (const key in obj) {
    const val = obj[key];
    const newKey = prefix ? `${prefix}_${key}` : key;
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      flatten(val, newKey, res);
    } else {
      res[newKey] = val;
    }
  }
  return res;
}

// 读取并平铺所有语言包
const allLangs = {};
langs.forEach(lang => {
  const filePath = path.join(localesDir, lang, fileName);
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(raw);
    allLangs[lang] = flatten(json);
  }
});

// 统计所有 key
const allKeys = new Set();
Object.values(allLangs).forEach(obj => Object.keys(obj).forEach(k => allKeys.add(k)));

// 用英文内容补全缺失key或空内容
const en = allLangs['en'] || {};
for (const lang in allLangs) {
  for (const key of allKeys) {
    if (!(key in allLangs[lang]) || allLangs[lang][key] === '') {
      allLangs[lang][key] = en[key] || '';
    }
  }
}

// 覆盖写回平铺后的 json
for (const lang in allLangs) {
  const filePath = path.join(localesDir, lang, fileName);
  const sorted = {};
  Array.from(allKeys).sort().forEach(k => { sorted[k] = allLangs[lang][k]; });
  fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2), 'utf-8');
  console.log(`[${lang}] 已平铺并补全，写回 ${filePath}`);
}

console.log('全部完成！'); 