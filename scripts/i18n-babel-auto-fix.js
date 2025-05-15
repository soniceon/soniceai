const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');

const CODE_DIR = path.join(__dirname, '../src');
const BACKUP_DIR = path.join(__dirname, '../src_backup_i18n');
const LOCALES_DIR = path.join(__dirname, '../public/locales');
const MAIN_LANG = 'en';
const JSON_FILE = 'common.json';

// 检查文件是否已引入 useTranslation 并定义 t
function hasTDefinition(ast) {
  let hasImport = false;
  let hasT = false;
  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value.includes('react-i18next')) hasImport = true;
    },
    VariableDeclarator(path) {
      if (
        t.isObjectPattern(path.node.id) &&
        path.node.id.properties.some(
          p => t.isObjectProperty(p) && p.key.name === 't'
        )
      ) {
        hasT = true;
      }
    }
  });
  return hasImport && hasT;
}

function genKey(text) {
  const hash = crypto.createHash('md5').update(text).digest('hex').slice(0, 6);
  return `auto_${text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 30)}_${hash}`;
}

function readLangJson(lang) {
  const file = path.join(LOCALES_DIR, lang, JSON_FILE);
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  return {};
}

function writeLangJson(lang, json) {
  const file = path.join(LOCALES_DIR, lang, JSON_FILE);
  fs.writeFileSync(file, JSON.stringify(json, null, 2), 'utf8');
}

function isHardcodedEnglish(str) {
  // 只处理2个及以上英文单词的字符串
  return /^[A-Za-z][A-Za-z0-9\s\-,'"!?.:;]{2,}[A-Za-z0-9.!?]$/.test(str.trim()) && /[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(str);
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest);
  fs.readdirSync(src).forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

function processFile(full, allKeys, allTexts, warnings) {
  let content = fs.readFileSync(full, 'utf8');
  let ext = path.extname(full);
  let isTS = ext === '.ts' || ext === '.tsx';
  let isJSX = ext === '.jsx' || ext === '.tsx';
  let ast;
  try {
    ast = parser.parse(content, {
      sourceType: 'module',
      plugins: [isTS ? 'typescript' : null, isJSX ? 'jsx' : null].filter(Boolean)
    });
  } catch (e) {
    console.error('Parse error:', full, e.message);
    return;
  }
  let changed = false;

  // 自动国际化
  traverse(ast, {
    StringLiteral(path) {
      // 跳过 import/export/require/define/注释等
      if (path.findParent(p => p.isImportDeclaration() || p.isExportDeclaration() || p.isImportSpecifier() || p.isExportSpecifier())) return;
      // 跳过 t('xxx') 里的内容
      if (path.parentPath.isCallExpression() && path.parent.callee.name === 't') return;
      // 跳过 defineMessages/define/require
      if (path.parentPath.isCallExpression() && ['defineMessages', 'define', 'require'].includes(path.parent.callee.name)) return;
      // 跳过空字符串
      if (!path.node.value.trim()) return;
      // 只处理硬编码英文
      if (!isHardcodedEnglish(path.node.value)) return;
      const key = genKey(path.node.value.trim());
      allKeys[key] = path.node.value.trim();
      allTexts.push({ file: full, text: path.node.value.trim(), key });
      changed = true;

      // 只在 JSX 标签内容（JSXText）用 {t('key')}
      // 在 JSX 属性、变量赋值、对象属性、数组等所有其它场景一律只用 t('key')
      path.replaceWith(t.callExpression(t.identifier('t'), [t.stringLiteral(key)]));
    },
    JSXText(path) {
      const value = path.node.value.trim();
      if (!value) return;
      if (!isHardcodedEnglish(value)) return;
      const key = genKey(value);
      allKeys[key] = value;
      allTexts.push({ file: full, text: value, key });
      changed = true;
      path.replaceWith(t.jsxExpressionContainer(t.callExpression(t.identifier('t'), [t.stringLiteral(key)])));
    },
    TemplateLiteral(path) {
      // 极端复杂场景，输出警告
      warnings.push({ file: full, code: generator(path.node).code });
    }
  });

  // 自动插入 t 的定义
  if (changed && !hasTDefinition(ast)) {
    // 插入 import { useTranslation } from 'react-i18next';
    const importDecl = t.importDeclaration(
      [t.importSpecifier(t.identifier('useTranslation'), t.identifier('useTranslation'))],
      t.stringLiteral('react-i18next')
    );
    ast.program.body.unshift(importDecl);

    // 插入 const { t } = useTranslation();
    const tDecl = t.variableDeclaration('const', [
      t.variableDeclarator(
        t.objectPattern([t.objectProperty(t.identifier('t'), t.identifier('t'), false, true)]),
        t.callExpression(t.identifier('useTranslation'), [])
      )
    ]);
    ast.program.body.splice(1, 0, tDecl); // 紧跟import后
  }

  if (changed) {
    const output = generator(ast, {}, content).code;
    fs.writeFileSync(full, output, 'utf8');
  }
}

function scanAndReplace(dir, allKeys, allTexts, warnings) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      scanAndReplace(full, allKeys, allTexts, warnings);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      processFile(full, allKeys, allTexts, warnings);
    }
  });
}

function main() {
  // 自动备份 src 目录
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log('正在自动备份 src/ 到 src_backup_i18n/...');
    copyDirSync(CODE_DIR, BACKUP_DIR);
    console.log('备份完成。');
  } else {
    console.log('已存在 src_backup_i18n/，跳过备份。');
  }

  const langs = fs.readdirSync(LOCALES_DIR).filter(f => fs.statSync(path.join(LOCALES_DIR, f)).isDirectory());
  const allKeys = {};
  const allTexts = [];
  const warnings = [];
  scanAndReplace(CODE_DIR, allKeys, allTexts, warnings);

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
  if (warnings.length) {
    console.log('\n[警告] 以下极端复杂场景未自动处理，请人工 review：');
    warnings.forEach(item => {
      console.log(`  ${item.file}: ${item.code}`);
    });
  }
  console.log('\n全部完成！请检查代码和语言包。');
}

main(); 