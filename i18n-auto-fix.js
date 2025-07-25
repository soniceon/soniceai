const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

// 解析命令行参数
const fullCheck = process.argv.includes('--full-check');

// 百度翻译API配置
const appid = '20250518002360182';
const key = 'n4PNMzKh0XnPUxl8uxGi';

// 语言映射（百度API语言代码）
const langMap = {
  zh: 'zh',
  en: 'en',
  ja: 'jp',
  ru: 'ru',
  de: 'de',
  fr: 'fra',
  es: 'spa',
  ko: 'kor',
  pt: 'pt'
};

const localesDir = path.join(__dirname, 'public', 'locales');
const langs = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());
const fileName = 'common.json';

// 递归扫描所有代码文件，提取国际化 key
function scanKeys(dir) {
  let keys = new Set();
  const exts = ['.js', '.jsx', '.ts', '.tsx'];
  function walk(d) {
    fs.readdirSync(d).forEach(f => {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) {
        walk(p);
      } else if (exts.includes(path.extname(f))) {
        const content = fs.readFileSync(p, 'utf-8');
        // t('key')/t("key")/t(`key`)
        const reg1 = /t\(['"`]([\w\d_\-.]+)['"`]\)/g;
        // i18n.t('key')
        const reg2 = /i18n\.t\(['"`]([\w\d_\-.]+)['"`]\)/g;
        // t(["key1", 'key2'])
        const reg3 = /t\(\[([^\]]+)\]\)/g;
        // <Trans i18nKey="key">
        const reg4 = /<Trans[^>]+i18nKey=["']([\w\d_\-.]+)["']/g;
        let m;
        while ((m = reg1.exec(content))) keys.add(m[1]);
        while ((m = reg2.exec(content))) keys.add(m[1]);
        while ((m = reg3.exec(content))) {
          m[1].split(',').forEach(k => {
            const key = k.trim().replace(/^['"`]|['"`]$/g, '');
            if (key) keys.add(key);
          });
        }
        while ((m = reg4.exec(content))) keys.add(m[1]);
      }
    });
  }
  walk(dir);
  return Array.from(keys);
}

// 检查硬编码文案
function scanHardcode(dir) {
  let results = [];
  const exts = ['.js', '.jsx', '.ts', '.tsx'];
  const zhReg = /[\u4e00-\u9fa5]+/g;
  const enReg = /['"`]([A-Za-z][^'"`\n\r]{3,})['"`]/g;
  function walk(d) {
    fs.readdirSync(d).forEach(f => {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) {
        walk(p);
      } else if (exts.includes(path.extname(f))) {
        const content = fs.readFileSync(p, 'utf-8');
        // 跳过 t('key')、i18n.t('key')、useTranslation、import/export等
        if (/i18n|useTranslation|t\(/.test(content)) return;
        // 查找中文
        let m;
        while ((m = zhReg.exec(content))) {
          if (m[0].length > 1) results.push(`${p}: ${m[0]}`);
        }
        // 查找英文句子
        while ((m = enReg.exec(content))) {
          if (m[1].split(' ').length > 2) results.push(`${p}: ${m[1]}`);
        }
      }
    });
  }
  walk(dir);
  return results;
}

// 百度翻译API调用
async function baiduTranslate(q, from, to) {
  const salt = Date.now();
  const sign = crypto.createHash('md5').update(appid + q + salt + key).digest('hex');
  const url = 'https://fanyi-api.baidu.com/api/trans/vip/translate';
  try {
    const res = await axios.get(url, {
      params: {
        q,
        from,
        to,
        appid,
        salt,
        sign
      }
    });
    if (res.data && res.data.trans_result && res.data.trans_result[0]) {
      return res.data.trans_result[0].dst;
    }
    return '';
  } catch (e) {
    console.error('翻译失败:', q, from, to, e.message);
    return '';
  }
}

async function fixI18nOnce() {
  // 1. 扫描所有 key
  const srcDir = path.join(__dirname, 'src');
  const keys = scanKeys(srcDir);
  console.log('扫描到的key数量:', keys.length);

  // 2. 读取英文包
  const enPath = path.join(localesDir, 'en', fileName);
  let enJson = {};
  if (fs.existsSync(enPath)) {
    enJson = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  }
  let changed = false;
  for (const key of keys) {
    if (!enJson[key] || enJson[key] === key) {
      // 用百度翻译自动填充英文包
      const translated = await baiduTranslate(key, 'zh', 'en');
      enJson[key] = translated || key;
      changed = true;
      console.log('[en] 翻译', key, ':', enJson[key]);
    }
  }
  // 强制补全 menu_xxx 相关 key
  const menuKeys = keys.filter(k => k.startsWith('menu_'));
  for (const key of menuKeys) {
    const translated = await baiduTranslate(key, 'zh', 'en');
    enJson[key] = translated || key;
    console.log('[en] 强制翻译', key, ':', enJson[key]);
  }
  fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2), 'utf-8');
  if (changed) console.log('已写回英文包');
  console.log('已强制写回英文包 menu_xxx key');

  // 3. 其它语言包补全并翻译
  let missingReport = {};
  for (const lang of langs) {
    if (lang === 'en') continue;
    const filePath = path.join(localesDir, lang, fileName);
    let json = {};
    if (fs.existsSync(filePath)) {
      json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    let changed = false;
    for (const key of keys) {
      if (!json[key] || json[key] === '' || json[key] === enJson[key] || json[key] === key) {
        const from = 'en';
        const to = langMap[lang] || lang;
        const text = enJson[key];
        if (!text) continue;
        console.log(`[${lang}] 翻译 ${key}: ${text}`);
        const translated = await baiduTranslate(text, from, to);
        if (translated) {
          json[key] = translated;
          changed = true;
          console.log(`  => ${translated}`);
        }
      }
      if (!json[key] || json[key] === '' || json[key] === enJson[key] || json[key] === key) {
        if (!missingReport[lang]) missingReport[lang] = [];
        missingReport[lang].push(key);
      }
    }
    // 强制补全 menu_xxx 相关 key
    for (const key of menuKeys) {
      const from = 'en';
      const to = langMap[lang] || lang;
      const text = enJson[key];
      const translated = await baiduTranslate(text, from, to);
      json[key] = translated || text;
      changed = true;
      console.log(`[${lang}] 强制翻译 ${key}: ${json[key]}`);
    }
    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
      console.log(`[${lang}] 已写回 ${filePath}`);
    }
  }
  fs.writeFileSync(path.join(__dirname, 'i18n-missing-report.json'), JSON.stringify(missingReport, null, 2), 'utf-8');
  console.log('已生成 i18n-missing-report.json');
  return missingReport;
}

async function fillMissingWithKey(missingReport, keys, enJson) {
  for (const lang in missingReport) {
    const filePath = path.join(localesDir, lang, fileName);
    let json = {};
    if (fs.existsSync(filePath)) {
      json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    let changed = false;
    for (const key of missingReport[lang]) {
      // 兜底：用英文包内容，没有就用 key 本身
      json[key] = enJson[key] || key;
      changed = true;
      console.log(`[${lang}] 兜底填充 ${key}: ${json[key]}`);
    }
    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
      console.log(`[${lang}] 已兜底写回 ${filePath}`);
    }
  }
}

async function fullCheckLoop(maxRetry = 5) {
  let retry = 0;
  let lastMissing = null;
  let lastKeys = null;
  let lastEnJson = null;
  while (retry < maxRetry) {
    console.log(`\n=== 第${retry + 1}轮自动修复 ===`);
    const missing = await fixI18nOnce();
    const totalMissing = Object.values(missing).reduce((a, b) => a + b.length, 0);
    // 记录最后一次的 key/enJson 以便兜底
    if (retry === maxRetry - 1 || totalMissing === 0) {
      const srcDir = path.join(__dirname, 'src');
      lastKeys = scanKeys(srcDir);
      const enPath = path.join(localesDir, 'en', fileName);
      lastEnJson = {};
      if (fs.existsSync(enPath)) {
        lastEnJson = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
      }
    }
    if (totalMissing === 0) {
      console.log('\n🎉 国际化100%完成！所有 key 均已翻译。');
      return;
    }
    if (JSON.stringify(missing) === JSON.stringify(lastMissing)) {
      console.log('\n部分 key 多次翻译失败，自动用英文 key 兜底补全...');
      await fillMissingWithKey(missing, lastKeys, lastEnJson);
      console.log('\n🎉 国际化100%完成（含兜底补全）！所有 key 均有内容。');
      return;
    }
    lastMissing = missing;
    retry++;
  }
  console.log('\n已达最大重试次数，部分 key 仍未翻译，自动用英文 key 兜底补全...');
  await fillMissingWithKey(lastMissing, lastKeys, lastEnJson);
  console.log('\n🎉 国际化100%完成（含兜底补全）！所有 key 均有内容。');
}

(async () => {
  if (fullCheck) {
    await fullCheckLoop(5);
  } else {
    await fixI18nOnce();
  }
})();

// 检查硬编码文案
const hardcodes = scanHardcode(path.join(__dirname, 'src'));
fs.writeFileSync(path.join(__dirname, 'i18n-hardcode-report.txt'), hardcodes.join('\n'), 'utf-8');
console.log('已生成 i18n-hardcode-report.txt');

console.log('全部修正、翻译和排查完成！'); 