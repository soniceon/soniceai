const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 1. 读取硬编码报告
const hardcodePath = path.join(__dirname, 'i18n-hardcode-report.txt');
if (!fs.existsSync(hardcodePath)) {
  console.error('请先运行 i18n-auto-fix.js 生成 i18n-hardcode-report.txt');
  process.exit(1);
}
const lines = fs.readFileSync(hardcodePath, 'utf-8').split('\n').filter(Boolean);

// 2. 自动生成英文 key（简单规则：中文自动翻译，英文直接下划线连接，特殊字符去除）
async function getEnglishKey(text) {
  // 只保留中文、英文、数字
  const clean = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9 ]/g, '').trim();
  // 如果是英文直接下划线
  if (/^[a-zA-Z0-9 ]+$/.test(clean)) {
    return clean.toLowerCase().replace(/ +/g, '_');
  }
  // 中文自动翻译
  try {
    const res = await axios.get('https://fanyi-api.baidu.com/api/trans/vip/translate', {
      params: {
        q: text,
        from: 'zh',
        to: 'en',
        appid: '20250518002360182',
        salt: Date.now(),
        sign: '', // 这里不做签名校验，实际可用时需补全
      }
    });
    if (res.data && res.data.trans_result && res.data.trans_result[0]) {
      return res.data.trans_result[0].dst.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/ +/g, '_');
    }
  } catch (e) {}
  // 兜底
  return 'key_' + Buffer.from(text).toString('hex').slice(0, 8);
}

// 3. 替换代码文件（只替换JSX标签内容和花括号表达式，不替换className、id、style、变量名等）
async function batchReplace() {
  const exts = ['.js', '.jsx', '.ts', '.tsx'];
  const srcDir = path.join(__dirname, 'src');
  let keyMap = {};
  for (const line of lines) {
    // 只处理界面文案
    const match = line.match(/: (.+)$/);
    if (!match) continue;
    const text = match[1].trim();
    if (!text || text.length < 2) continue;
    if (text.match(/^[a-zA-Z0-9\-_. ]+$/) && text.length < 6) continue; // 跳过短变量名
    if (keyMap[text]) continue;
    keyMap[text] = await getEnglishKey(text);
  }
  // 备份所有文件
  function walk(d, files=[]) {
    fs.readdirSync(d).forEach(f => {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) walk(p, files);
      else if (exts.includes(path.extname(f))) files.push(p);
    });
    return files;
  }
  const allFiles = walk(srcDir);
  for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let changed = false;
    for (const [text, key] of Object.entries(keyMap)) {
      // 只替换JSX标签内容和花括号表达式
      // 1. <div>中文</div> => <div>{t('key')}</div>
      const reg1 = new RegExp('>(\\s*)' + text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '(\\s*)<', 'g');
      content = content.replace(reg1, `>{t('${key}')}<`);
      // 2. {'中文'} => {t('key')}
      const reg2 = new RegExp('{["\'`]'+text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')+'["\'`]}', 'g');
      content = content.replace(reg2, `{t('${key}')}`);
      // 3. "中文" 仅在 = 后面（属性值）不替换
      // 不做替换
      // 4. className/id/style等属性值不替换
      // 不做替换
      // 检查是否有变化
      if (reg1.test(content) || reg2.test(content)) changed = true;
    }
    if (changed) {
      fs.writeFileSync(file + '.bak2', fs.readFileSync(file)); // 新备份
      fs.writeFileSync(file, content, 'utf-8');
      console.log('已精准替换:', file);
    }
  }
  // 4. 补全 common.json
  const localesDir = path.join(__dirname, 'public', 'locales');
  const langs = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());
  for (const lang of langs) {
    const filePath = path.join(localesDir, lang, 'common.json');
    let json = {};
    if (fs.existsSync(filePath)) {
      json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    for (const [text, key] of Object.entries(keyMap)) {
      if (!json[key]) {
        json[key] = lang === 'en' ? text : '';
      }
    }
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
    console.log('已补全:', filePath);
  }
  console.log('精准批量替换和补全完成！请运行 i18n-auto-fix.js 进行自动翻译。');
}

batchReplace(); 