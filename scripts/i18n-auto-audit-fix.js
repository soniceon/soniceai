const fs = require('fs');
const path = require('path');

// 配置区
const CODE_DIR = path.join(__dirname, '../src');
const LOCALES_DIR = path.join(__dirname, '../public/locales');
const MAIN_LANG = 'en'; // 主语言，缺失 key 用它填充
const JSON_FILE = 'common.json';

// 递归扫描所有 t('xxx') key
function findTKeys(dir, keys = new Set()) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      findTKeys(full, keys);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      const content = fs.readFileSync(full, 'utf8');
      const regex = /t\(\s*['"`]{1}([^'"`\)]+)['"`]{1}\s*\)/g;
      let match;
      while ((match = regex.exec(content))) {
        keys.add(match[1]);
      }
    }
  });
  return keys;
}

// 读取所有语言包
function readLangJson(lang) {
  const file = path.join(LOCALES_DIR, lang, JSON_FILE);
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  return {};
}

// 写回语言包
function writeLangJson(lang, json) {
  const file = path.join(LOCALES_DIR, lang, JSON_FILE);
  fs.writeFileSync(file, JSON.stringify(json, null, 2), 'utf8');
}

// 主流程
function main() {
  const langs = fs.readdirSync(LOCALES_DIR).filter(f => fs.statSync(path.join(LOCALES_DIR, f)).isDirectory());
  const allKeys = Array.from(findTKeys(CODE_DIR));
  console.log(`全站共发现 t() key 数量: ${allKeys.length}`);

  // 读取主语言内容
  const mainJson = readLangJson(MAIN_LANG);

  langs.forEach(lang => {
    const json = readLangJson(lang);
    let changed = false;
    const missing = [];
    const unused = [];

    // 补全缺失 key
    allKeys.forEach(key => {
      if (!(key in json)) {
        json[key] = mainJson[key] || '';
        missing.push(key);
        changed = true;
      }
    });
    // 检查冗余 key
    Object.keys(json).forEach(key => {
      if (!allKeys.includes(key)) {
        unused.push(key);
      }
    });
    // 写回
    if (changed) {
      writeLangJson(lang, json);
      console.log(`[${lang}] 已补全缺失 key: ${missing.length} 个`);
    } else {
      console.log(`[${lang}] 无缺失 key`);
    }
    if (unused.length) {
      console.log(`[${lang}] 冗余 key: ${unused.length} 个 ->`, unused);
    }
  });

  // 检查硬编码英文
  let hardCoded = [];
  function scanHardCode(dir) {
    fs.readdirSync(dir).forEach(file => {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) {
        scanHardCode(full);
      } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
        const content = fs.readFileSync(full, 'utf8');
        // 粗略检测：连续2个及以上英文单词
        const regex = /['"`]([A-Za-z][A-Za-z\s\-]{2,}[A-Za-z])['"`]/g;
        let match;
        while ((match = regex.exec(content))) {
          // 排除 t('xxx') 里的内容
          if (!/t\(\s*['"`]/.test(content.slice(match.index - 5, match.index))) {
            hardCoded.push({ file: full, text: match[1] });
          }
        }
      }
    });
  }
  scanHardCode(CODE_DIR);
  if (hardCoded.length) {
    console.log('\n[警告] 检测到疑似硬编码英文：');
    hardCoded.forEach(item => {
      console.log(`  ${item.file}: ${item.text}`);
    });
  } else {
    console.log('\n未检测到硬编码英文。');
  }

  console.log('\n全部完成！请检查上方报告。');
}

main(); 