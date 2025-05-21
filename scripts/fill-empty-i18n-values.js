const fs = require('fs');
const path = require('path');
const { translate } = require('./baiduTranslate');

const langs = ['en', 'zh', 'ja', 'ko', 'de', 'fr', 'es', 'ru'];
const localesPath = path.join(__dirname, '../public/locales');
const baseLang = 'en';

function beautifyKey(key) {
  // 替换下划线为空格，分词，首字母大写
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\b([ai])\b/g, c => c.toUpperCase()); // AI大写
}

async function fillAll() {
  // 1. 以英文包为基准
  const enFile = path.join(localesPath, baseLang, 'common.json');
  let enJson = {};
  if (fs.existsSync(enFile)) {
    enJson = JSON.parse(fs.readFileSync(enFile, 'utf8'));
  }
  let enChanged = false;
  for (const key in enJson) {
    if (!enJson[key] || enJson[key] === '' || enJson[key] === key) {
      enJson[key] = beautifyKey(key);
      enChanged = true;
    }
  }
  if (enChanged) {
    fs.writeFileSync(enFile, JSON.stringify(enJson, null, 2), 'utf8');
    console.log('English common.json auto-filled and saved!');
  }

  // 2. 遍历所有语言包
  for (const lang of langs) {
    if (lang === baseLang) continue;
    const file = path.join(localesPath, lang, 'common.json');
    let json = {};
    if (fs.existsSync(file)) {
      json = JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    let changed = false;
    for (const key in enJson) {
      if (lang === 'en') continue;
      try {
        const enVal = enJson[key];
        if (!enVal) continue;
        const res = await translate(enVal, lang);
        console.log(`[${lang}] FORCE Translating: key='${key}', en='${enVal}' => result='${res}'`);
        if (res && typeof res === 'string' && res !== enVal) {
          json[key] = res;
        } else {
          json[key] = enVal;
          console.warn(`[${lang}] Fallback to en: key='${key}', en='${enVal}'`);
        }
      } catch (e) {
        console.error(`[${lang}] Translate error: key='${key}', en='${enVal}', error=`, e);
        json[key] = enJson[key];
      }
      changed = true;
    }
    // 保证所有 key 都存在
    for (const key in enJson) {
      if (!(key in json)) {
        json[key] = enJson[key];
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(file, JSON.stringify(json, null, 2), 'utf8');
      console.log(`${lang} common.json force-filled and saved!`);
    }
  }
}

fillAll(); 