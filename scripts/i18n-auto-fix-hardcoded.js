const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CODE_DIR = path.join(__dirname, '../src');
const LOCALES_DIR = path.join(__dirname, '../public/locales');
const MAIN_LANG = 'en';
const JSON_FILE = 'common.json';

// 生成唯一 key
function genKey(text) {
  const hash = crypto.createHash('md5').update(text).digest('hex').slice(0, 6);
  return `auto_${text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 30)}_${hash}`;
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

// 处理单个文件
function processFile(full, allKeys, allTexts) {
  let content = fs.readFileSync(full, 'utf8');
  let changed = false;

  // 1. 处理 JSX 标签内容 <Tag>Some Text</Tag> => <Tag>{t('key')}</Tag>
  content = content.replace(/<([A-Za-z0-9]+)([^>]*)>([^<>{}\n\r]+)<\/\1>/g, (match, tag, attrs, text) => {
    // 跳过空白和纯变量内容
    if (!text.trim() || /^{.*}$/.test(text.trim())) return match;
    // 跳过已国际化内容
    if (/t\(['"`]/.test(text)) return match;
    // 只处理英文
    if (!/^[A-Za-z0-9\s\-,'"!?.:;]+$/.test(text.trim())) return match;
    const key = genKey(text.trim());
    allKeys[key] = text.trim();
    allTexts.push({ file: full, text: text.trim(), key });
    changed = true;
    return `<${tag}${attrs}>{t('${key}')}</${tag}>`;
  });

  // 2. 处理 JSX 属性 prop="Some Text" => prop={t('key')}
  content = content.replace(/([a-zA-Z0-9_]+)=(["'])([A-Z][A-Za-z\s\-]{2,}[A-Za-z0-9!?.:;,'"]*)\2/g, (match, prop, quote, text) => {
    // 跳过已国际化内容
    if (/t\(['"`]/.test(text)) return match;
    const key = genKey(text.trim());
    allKeys[key] = text.trim();
    allTexts.push({ file: full, text: text.trim(), key });
    changed = true;
    return `${prop}={t('${key}')}`;
  });

  // 3. 处理普通 JS/TS 字符串 "Some Text" => t('key')
  content = content.replace(/([=:\[,]\s*)(["'])([A-Z][A-Za-z\s\-]{2,}[A-Za-z0-9!?.:;,'"]*)\2/g, (match, prefix, quote, text) => {
    // 跳过已国际化内容
    if (/t\(['"`]/.test(text)) return match;
    const key = genKey(text.trim());
    allKeys[key] = text.trim();
    allTexts.push({ file: full, text: text.trim(), key });
    changed = true;
    return `${prefix}t('${key}')`;
  });

  if (changed) {
    fs.writeFileSync(full, content, 'utf8');
  }
}

// 递归扫描并处理
function scanAndReplace(dir, allKeys, allTexts) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      scanAndReplace(full, allKeys, allTexts);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      processFile(full, allKeys, allTexts);
    }
  });
}

function main() {
  const langs = fs.readdirSync(LOCALES_DIR).filter(f => fs.statSync(path.join(LOCALES_DIR, f)).isDirectory());
  const allKeys = {};
  const allTexts = [];
  scanAndReplace(CODE_DIR, allKeys, allTexts);

  if (Object.keys(allKeys).length === 0) {
    console.log('未检测到可自动国际化的硬编码英文。');
    return;
  }

  // 读取主语言内容
  const mainJson = readLangJson(MAIN_LANG);
  // 写入所有语言包
  langs.forEach(lang => {
    const json = readLangJson(lang);
    Object.keys(allKeys).forEach(key => {
      if (!(key in json)) {
        json[key] = lang === MAIN_LANG ? allKeys[key] : '';
      }
    });
    writeLangJson(lang, json);
  });

  // 输出修正报告
  console.log('已自动修正以下硬编码英文为 t() 并写入语言包：');
  allTexts.forEach(item => {
    console.log(`${item.file}: "${item.text}" => t('${item.key}')`);
  });
  console.log('\n全部完成！请检查代码和语言包。');
}

main(); 