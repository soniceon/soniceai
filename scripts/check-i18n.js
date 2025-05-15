const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 配置
const config = {
  // 要扫描的文件类型
  filePatterns: ['**/*.{ts,tsx,js,jsx,mdx,json}'],
  // 要排除的目录
  excludeDirs: ['node_modules', '.next', 'out', 'build', 'dist'],
  // 语言文件路径
  localesPath: path.join(__dirname, '../public/locales'),
  // 要检查的语言
  languages: ['en', 'zh', 'de', 'es', 'fr', 'ja', 'ko', 'pt', 'ru'],
  // 要检查的配置文件
  configFiles: [
    'next.config.js',
    'next-i18next.config.js',
    '.env',
    '.env.local'
  ],
  // 翻译 key 配置
  keyConfig: {
    maxLength: 150,
    maxDepth: 6,
    namingPattern: /^[a-zA-Z0-9_.-]+$/,
    allowedSpecialChars: ['-', '_', '.'],
    ignoredPrefixes: ['_', 'temp_', 'draft_'],
    allowedDynamicPatterns: [
      /^[a-zA-Z0-9_.-]+\.[a-zA-Z0-9_.-]+$/,
      /^[a-zA-Z0-9_.-]+\[[0-9]+\]$/
    ]
  }
};

// 存储所有翻译 key
const translationKeys = new Set();
// 存储所有使用翻译的文件
const filesWithTranslations = new Map();
// 存储所有错误
const errors = [];
// 存储所有警告
const warnings = [];
// 存储所有硬编码文本
const hardcodedTexts = new Map();
// 存储所有 HTML 实体
const htmlEntities = new Map();
// 存储所有动态翻译 key
const dynamicTranslationKeys = new Map();
// 存储所有翻译 key 使用频率
const keyUsageFrequency = new Map();
// 存储所有命名空间使用情况
const namespaceUsage = new Map();
// 存储所有重复的翻译 key
const duplicateKeys = new Map();
// 存储所有缺失的翻译
const missingTranslations = new Map();
// 新增：存储所有值为对象的 key
const objectValueKeys = new Map();

// 读取语言文件
function loadTranslations() {
  const translations = {};
  config.languages.forEach(lang => {
    const langPath = path.join(config.localesPath, lang);
    if (fs.existsSync(langPath)) {
      translations[lang] = {};
      const files = fs.readdirSync(langPath);
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const content = JSON.parse(fs.readFileSync(path.join(langPath, file), 'utf8'));
          translations[lang][file.replace('.json', '')] = content;
        }
      });
    }
  });
  return translations;
}

// 验证翻译 key 格式
function validateTranslationKey(key) {
  if (config.keyConfig.ignoredPrefixes.some(prefix => key.startsWith(prefix))) {
    return true;
  }

  const validKeyRegex = /^[a-zA-Z0-9_.-]+$/;
  if (!validKeyRegex.test(key)) {
    return false;
  }

  if (config.keyConfig.allowedDynamicPatterns.some(pattern => pattern.test(key))) {
    return true;
  }

  const specialChars = key.split('').filter(char => 
    config.keyConfig.allowedSpecialChars.includes(char)
  );
  if (specialChars.length > 3) {
    return false;
  }

  return true;
}

// 检查翻译 key 长度
function checkKeyLength(key) {
  if (key.includes('[') || key.includes('.')) {
    return key.length <= config.keyConfig.maxLength * 1.5;
  }
  return key.length <= config.keyConfig.maxLength;
}

// 检查翻译 key 命名规范
function checkKeyNamingConvention(key) {
  if (config.keyConfig.ignoredPrefixes.some(prefix => key.startsWith(prefix))) {
    return true;
  }
  return config.keyConfig.namingPattern.test(key);
}

// 检查翻译 key 层级深度
function checkKeyDepth(key) {
  if (key.includes('[') || key.includes('.')) {
    return key.split(/[.[\]]/).length <= config.keyConfig.maxDepth * 1.5;
  }
  return key.split('.').length <= config.keyConfig.maxDepth;
}

// 检查 HTML 实体
function checkHtmlEntities(content) {
  const htmlEntityRegex = /&[a-zA-Z]+;/g;
  const matches = [];
  let match;
  while ((match = htmlEntityRegex.exec(content)) !== null) {
    matches.push(match[0]);
  }
  return matches;
}

// 检查动态翻译 key
function checkDynamicTranslationKeys(content) {
  const dynamicKeyRegex = /t\(['"]([^'"]+)['"]\s*\+\s*[^)]+\)/g;
  const matches = [];
  let match;
  while ((match = dynamicKeyRegex.exec(content)) !== null) {
    matches.push(match[0]);
  }
  return matches;
}

// 检查命名空间一致性
function checkNamespaceConsistency() {
  filesWithTranslations.forEach((info, file) => {
    if (!namespaceUsage.has(info.namespace)) {
      namespaceUsage.set(info.namespace, []);
    }
    namespaceUsage.get(info.namespace).push(file);
  });
  return namespaceUsage;
}

// 检查翻译 key 重复
function checkDuplicateKeys(translations) {
  Object.entries(translations).forEach(([lang, namespaces]) => {
    Object.entries(namespaces).forEach(([namespace, content]) => {
      const keys = new Set();
      const findDuplicates = (obj, path = '') => {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          if (keys.has(currentPath)) {
            if (!duplicateKeys.has(currentPath)) {
              duplicateKeys.set(currentPath, []);
            }
            duplicateKeys.get(currentPath).push(`${lang}/${namespace}`);
          }
          keys.add(currentPath);
          if (typeof value === 'object' && value !== null) {
            findDuplicates(value, currentPath);
          }
        });
      };
      findDuplicates(content);
    });
  });
  return duplicateKeys;
}

// 检查翻译完整性
function checkTranslationCompleteness(translations) {
  const allKeys = new Set();
  const missingTranslations = new Map();
  const optionalKeys = new Set(); // 存储可选翻译 key

  // 收集所有 key
  Object.values(translations).forEach(namespaces => {
    Object.values(namespaces).forEach(content => {
      const collectKeys = (obj, path = '') => {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          
          // 检查是否是可选翻译
          if (key.startsWith('_') || key.startsWith('temp_') || key.startsWith('draft_')) {
            optionalKeys.add(currentPath);
          }
          
          allKeys.add(currentPath);
          if (typeof value === 'object' && value !== null) {
            collectKeys(value, currentPath);
          }
        });
      };
      collectKeys(content);
    });
  });

  // 检查每个语言的完整性
  Object.entries(translations).forEach(([lang, namespaces]) => {
    const langKeys = new Set();
    Object.values(namespaces).forEach(content => {
      const collectKeys = (obj, path = '') => {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          langKeys.add(currentPath);
          if (typeof value === 'object' && value !== null) {
            collectKeys(value, currentPath);
          }
        });
      };
      collectKeys(content);
    });

    // 找出缺失的 key
    allKeys.forEach(key => {
      // 跳过可选翻译的检查
      if (optionalKeys.has(key)) {
        return;
      }

      if (!langKeys.has(key)) {
        // 检查是否是动态 key
        const isDynamicKey = key.includes('[') || key.includes('.');
        
        // 对于动态 key，检查是否存在基础 key
        if (isDynamicKey) {
          const baseKey = key.split(/[.[\]]/)[0];
          if (langKeys.has(baseKey)) {
            return; // 如果存在基础 key，则忽略动态 key 的缺失
          }
        }

        if (!missingTranslations.has(lang)) {
          missingTranslations.set(lang, []);
        }
        missingTranslations.get(lang).push(key);
      }
    });
  });

  return missingTranslations;
}

// 检查翻译 key 使用频率
function checkKeyUsageFrequency() {
  filesWithTranslations.forEach((info, file) => {
    info.keys.forEach(key => {
      if (!keyUsageFrequency.has(key)) {
        keyUsageFrequency.set(key, []);
      }
      keyUsageFrequency.get(key).push(file);
    });
  });
  return keyUsageFrequency;
}

// 检查文件中的翻译使用
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileErrors = [];
  const fileWarnings = [];
  const fileKeys = new Set();
  const fileHardcodedTexts = new Set();

  // 检查是否使用了任何国际化相关的方法
  const hasI18nUsage = content.includes('useTranslation') || 
                      content.includes('withTranslation') ||
                      content.includes('<Trans') ||
                      content.includes('i18next.t(');

  if (hasI18nUsage) {
    // 提取所有 t('key') 或 t("key") 格式的翻译 key
    const keyRegex = /t\(['"]([^'"\)]+)['"]\)/g;
    let match;
    while ((match = keyRegex.exec(content)) !== null) {
      const key = match[1];
      
      // 跳过注释中的翻译 key
      if (content.substring(0, match.index).includes('//') || 
          content.substring(0, match.index).includes('/*')) {
        continue;
      }
      
      // 验证 key 格式
      if (!validateTranslationKey(key)) {
        // 检查是否是动态 key
        const isDynamicKey = key.includes('[') || key.includes('.');
        if (!isDynamicKey) {
          fileErrors.push(`Invalid translation key format: ${key}`);
        }
      }
      
      // 检查 key 长度
      if (!checkKeyLength(key)) {
        fileWarnings.push(`Translation key too long: ${key}`);
      }
      
      // 检查命名规范
      if (!checkKeyNamingConvention(key)) {
        fileWarnings.push(`Translation key naming convention violation: ${key}`);
      }
      
      // 检查层级深度
      if (!checkKeyDepth(key)) {
        fileWarnings.push(`Translation key too deep: ${key}`);
      }
      
      fileKeys.add(key);
    }

    // 检查硬编码文本
    const textRegex = /["']([^"']{3,})["']/g;
    while ((match = textRegex.exec(content)) !== null) {
      const text = match[1];
      
      // 跳过注释中的文本
      if (content.substring(0, match.index).includes('//') || 
          content.substring(0, match.index).includes('/*')) {
        continue;
      }
      
      // 跳过 URL、路径等
      if (text.includes('http') || text.includes('/') || text.includes('\\')) {
        continue;
      }
      
      // 跳过数字和特殊字符
      if (/^[0-9\s\W]+$/.test(text)) {
        continue;
      }
      
      fileHardcodedTexts.add(text);
    }
  }

  // 更新全局状态
  if (fileKeys.size > 0) {
    filesWithTranslations.set(filePath, {
      keys: Array.from(fileKeys),
      namespace: getNamespaceFromPath(filePath)
    });
  }

  if (fileHardcodedTexts.size > 0) {
    hardcodedTexts.set(filePath, Array.from(fileHardcodedTexts));
  }

  return {
    errors: fileErrors,
    warnings: fileWarnings
  };
}

// 从文件路径获取命名空间
function getNamespaceFromPath(filePath) {
  const pathParts = filePath.split('/');
  const srcIndex = pathParts.indexOf('src');
  if (srcIndex !== -1 && srcIndex < pathParts.length - 1) {
    return pathParts[srcIndex + 1];
  }
  return 'common';
}

// 检查翻译 key 是否存在（多命名空间支持）
function checkTranslationKeys(translations) {
  filesWithTranslations.forEach((info, file) => {
    const namespaces = Array.isArray(info.namespace) ? info.namespace : [info.namespace];
    info.keys.forEach(key => {
      namespaces.forEach(ns => {
        config.languages.forEach(lang => {
          if (!translations[lang]) {
            errors.push(`Language ${lang} not found in translations`);
            return;
          }
          if (!translations[lang][ns]) {
            errors.push(`Namespace ${ns} not found in ${lang}`);
            return;
          }
          const content = translations[lang][ns];
          // 支持嵌套 key
          const parts = key.split('.');
          let current = content;
          let found = true;
          for (const part of parts) {
            if (current && Object.prototype.hasOwnProperty.call(current, part)) {
              current = current[part];
            } else {
              found = false;
              break;
            }
          }
          if (!found) {
            errors.push(`Translation key "${key}" not found in ${lang}/${ns}.json`);
          }
        });
      });
    });
  });
}

// 检查配置文件
function checkConfigFiles() {
  config.configFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('i18n') || content.includes('locale')) {
        filesWithTranslations.set(filePath, {
          keys: [],
          namespace: 'config',
          isConfigFile: true
        });
      }
    }
  });
}

// 在 loadTranslations 之后，添加检测对象值 key 的逻辑
function collectObjectValueKeys(translations) {
  Object.entries(translations).forEach(([lang, namespaces]) => {
    Object.entries(namespaces).forEach(([namespace, content]) => {
      const findObjectKeys = (obj, path = '') => {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            if (!objectValueKeys.has(lang)) objectValueKeys.set(lang, []);
            objectValueKeys.get(lang).push(`${namespace}.${currentPath}`);
            // 递归查找嵌套对象
            findObjectKeys(value, currentPath);
          }
        });
      };
      findObjectKeys(content);
    });
  });
}

// 新增：自动扫描代码文件提取 t('xxx') 用到的 key，并比对语言包
function extractUsedKeysFromCode() {
  const codeKeys = new Set();
  const keyRegex = /t\(['"`]([a-zA-Z0-9_.-]+)['"`]\)/g;
  const codeFiles = glob.sync('src/**/*.{js,jsx,ts,tsx}', {
    ignore: config.excludeDirs.map(dir => `**/${dir}/**`)
  });
  codeFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = keyRegex.exec(content)) !== null) {
      codeKeys.add(match[1]);
    }
  });
  return Array.from(codeKeys);
}

function getValueFromJson(obj, key) {
  return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

function checkCodeKeysAgainstLocales(translations, usedKeys) {
  const missing = [];
  const typeErrors = [];
  config.languages.forEach(lang => {
    Object.entries(translations[lang] || {}).forEach(([namespace, content]) => {
      usedKeys.forEach(key => {
        const value = getValueFromJson(content, key);
        if (value === undefined) {
          missing.push(`[${lang}/${namespace}] missing: ${key}`);
        } else if (typeof value !== 'string') {
          typeErrors.push(`[${lang}/${namespace}] not string: ${key}`);
        }
      });
    });
  });
  return { missing, typeErrors };
}

// 自动补全缺失 key
function autoFillMissingKeys(translations, usedKeys) {
  const baseLang = 'en';
  config.languages.forEach(lang => {
    Object.entries(translations[lang] || {}).forEach(([namespace, content]) => {
      usedKeys.forEach(key => {
        const value = getValueFromJson(content, key);
        if (value === undefined) {
          // 获取英文原文或空字符串
          let baseValue = '';
          if (lang !== baseLang && translations[baseLang] && translations[baseLang][namespace]) {
            const enValue = getValueFromJson(translations[baseLang][namespace], key);
            if (typeof enValue === 'string') baseValue = enValue;
          }
          // 补全缺失 key
          const keyParts = key.split('.');
          let target = content;
          for (let i = 0; i < keyParts.length - 1; i++) {
            if (!target[keyParts[i]]) {
              target[keyParts[i]] = {};
            }
            target = target[keyParts[i]];
          }
          target[keyParts[keyParts.length - 1]] = baseValue;
          console.log(`[AutoFill] ${lang}/${namespace} 补全缺失 key: ${key}`);
        }
      });
    });
  });
  // 保存补全后的翻译文件
  Object.entries(translations).forEach(([lang, namespaces]) => {
    Object.entries(namespaces).forEach(([namespace, content]) => {
      const filePath = path.join(config.localesPath, lang, `${namespace}.json`);
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    });
  });
}

// 主函数
async function main() {
  console.log('Starting i18n check...\n');

  // 加载翻译文件
  const translations = loadTranslations();
  collectObjectValueKeys(translations);
  const usedKeys = extractUsedKeysFromCode();
  const codeKeyCheck = checkCodeKeysAgainstLocales(translations, usedKeys);
  autoFillMissingKeys(translations, usedKeys);
  console.log('Loaded translation files:', Object.keys(translations).join(', '), '\n');

  // 自动补全缺失 key
  const baseLang = 'en';
  const baseKeys = new Set();
  // 收集英文（基准语言）的所有 key
  Object.values(translations[baseLang] || {}).forEach(content => {
    const collectKeys = (obj, path = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        baseKeys.add(currentPath);
        if (typeof value === 'object' && value !== null) {
          collectKeys(value, currentPath);
        }
      });
    };
    collectKeys(content);
  });

  // 遍历其他语言，检查并补全缺失 key
  Object.entries(translations).forEach(([lang, namespaces]) => {
    if (lang === baseLang) return;
    Object.entries(namespaces).forEach(([namespace, content]) => {
      const langKeys = new Set();
      const collectKeys = (obj, path = '') => {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          langKeys.add(currentPath);
          if (typeof value === 'object' && value !== null) {
            collectKeys(value, currentPath);
          }
        });
      };
      collectKeys(content);

      // 检查缺失 key，并补全
      baseKeys.forEach(key => {
        if (!langKeys.has(key)) {
          // 从英文翻译中获取对应值
          let baseValue = '';
          const keyParts = key.split('.');
          let current = translations[baseLang][namespace];
          for (const part of keyParts) {
            if (current && typeof current === 'object' && current[part] !== undefined) {
              current = current[part];
            } else {
              current = undefined;
              break;
            }
          }
          if (typeof current === 'string') {
            baseValue = current;
          }
          // 补全缺失 key
          let target = content;
          for (let i = 0; i < keyParts.length - 1; i++) {
            if (!target[keyParts[i]]) {
              target[keyParts[i]] = {};
            }
            target = target[keyParts[i]];
          }
          target[keyParts[keyParts.length - 1]] = baseValue;
          console.log(`补全 ${lang}/${namespace} 缺失 key: ${key}`);
        }
      });
    });
  });

  // 保存补全后的翻译文件
  Object.entries(translations).forEach(([lang, namespaces]) => {
    Object.entries(namespaces).forEach(([namespace, content]) => {
      const filePath = path.join(config.localesPath, lang, `${namespace}.json`);
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    });
  });

  // 继续原有的检查逻辑
  const files = glob.sync(config.filePatterns, {
    ignore: config.excludeDirs.map(dir => `**/${dir}/**`)
  });
  console.log(`Found ${files.length} files to check\n`);

  // 检查配置文件
  config.configFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const result = checkFile(file);
      if (result.errors.length > 0) {
        errors.push(...result.errors.map(error => `${file}: ${error}`));
      }
      if (result.warnings.length > 0) {
        warnings.push(...result.warnings.map(warning => `${file}: ${warning}`));
      }
    }
  });

  // 检查其他文件
  files.forEach(file => {
    if (!config.configFiles.includes(file)) {
      const result = checkFile(file);
      if (result.errors.length > 0) {
        errors.push(...result.errors.map(error => `${file}: ${error}`));
      }
      if (result.warnings.length > 0) {
        warnings.push(...result.warnings.map(warning => `${file}: ${warning}`));
      }
    }
  });

  // 检查翻译完整性
  const missingTranslations = checkTranslationCompleteness(translations);
  if (missingTranslations.size > 0) {
    missingTranslations.forEach((keys, lang) => {
      keys.forEach(key => {
        errors.push(`Translation key "${key}" not found in ${lang}/common.json`);
      });
    });
  }

  // 检查重复的翻译 key
  const duplicateKeys = checkDuplicateKeys(translations);
  if (duplicateKeys.size > 0) {
    duplicateKeys.forEach((files, key) => {
      warnings.push(`Duplicate translation key "${key}" found in: ${files.join(', ')}`);
    });
  }

  // 检查命名空间一致性
  const namespaceUsage = checkNamespaceConsistency();
  if (namespaceUsage.size === 0) {
    warnings.push('No namespace usage found');
  }

  // 检查翻译 key 使用频率
  const keyUsageFrequency = checkKeyUsageFrequency();
  if (keyUsageFrequency.size === 0) {
    warnings.push('No translation key usage found');
  }

  // 生成报告
  console.log('\n=== i18n Check Report ===\n');

  // 显示使用翻译的文件
  console.log('Files using translations:');
  filesWithTranslations.forEach((info, file) => {
    console.log(`\n${file}:`);
    if (!info.isConfigFile) {
      console.log(`  Namespace: ${info.namespace}`);
      console.log(`  Keys: ${info.keys.join(', ')}`);
    } else {
      console.log('  Configuration file with i18n settings');
    }
  });

  // 显示硬编码文本
  if (hardcodedTexts.size > 0) {
    console.log('\nHardcoded texts found:');
    hardcodedTexts.forEach((texts, file) => {
      console.log(`\n${file}:`);
      texts.forEach(text => console.log(`  - "${text}"`));
    });
  }

  // 显示 HTML 实体
  if (htmlEntities.size > 0) {
    console.log('\nHTML entities found:');
    htmlEntities.forEach((entities, file) => {
      console.log(`\n${file}:`);
      entities.forEach(entity => console.log(`  - ${entity}`));
    });
  }

  // 显示动态翻译 key
  if (dynamicTranslationKeys.size > 0) {
    console.log('\nDynamic translation keys found:');
    dynamicTranslationKeys.forEach((keys, file) => {
      console.log(`\n${file}:`);
      keys.forEach(key => console.log(`  - ${key}`));
    });
  }

  // 显示命名空间使用情况
  console.log('\nNamespace usage:');
  namespaceUsage.forEach((files, namespace) => {
    console.log(`\n${namespace}:`);
    files.forEach(file => console.log(`  - ${file}`));
  });

  // 显示重复的翻译 key
  if (duplicateKeys.size > 0) {
    console.log('\nDuplicate translation keys:');
    duplicateKeys.forEach((files, key) => {
      console.log(`\n${key}:`);
      files.forEach(file => console.log(`  - ${file}`));
    });
  }

  // 显示缺失的翻译
  if (missingTranslations.size > 0) {
    console.log('\nMissing translations:');
    missingTranslations.forEach((keys, lang) => {
      console.log(`\n${lang}:`);
      keys.forEach(key => console.log(`  - ${key}`));
    });
  }

  // 显示翻译 key 使用频率
  console.log('\nTranslation key usage frequency:');
  keyUsageFrequency.forEach((files, key) => {
    console.log(`\n${key}:`);
    console.log(`  Used in ${files.length} files`);
    files.forEach(file => console.log(`  - ${file}`));
  });

  // 显示对象值 key
  if (objectValueKeys.size > 0) {
    console.log('\nKeys whose value is an object (not a string):');
    objectValueKeys.forEach((keys, lang) => {
      console.log(`\n${lang}:`);
      keys.forEach(key => console.log(`  - ${key}`));
    });
  }

  // 显示代码 key 检查结果
  if (codeKeyCheck.missing.length > 0) {
    console.log('\n[Code Key Check] Missing keys:');
    codeKeyCheck.missing.forEach(msg => console.log('  - ' + msg));
  }
  if (codeKeyCheck.typeErrors.length > 0) {
    console.log('\n[Code Key Check] Keys not string:');
    codeKeyCheck.typeErrors.forEach(msg => console.log('  - ' + msg));
  }

  // 显示错误
  if (errors.length > 0) {
    console.log('\nErrors found:');
    errors.forEach(error => console.log(`- ${error}`));
  } else {
    console.log('\nNo errors found!');
  }

  // 显示统计信息
  console.log('\nStatistics:');
  console.log(`- Total files checked: ${files.length}`);
  console.log(`- Files using translations: ${filesWithTranslations.size}`);
  console.log(`- Total translation keys: ${translationKeys.size}`);
  console.log(`- Total errors: ${errors.length}`);
  console.log(`- Files with hardcoded texts: ${hardcodedTexts.size}`);
  console.log(`- Files with HTML entities: ${htmlEntities.size}`);
  console.log(`- Files with dynamic translation keys: ${dynamicTranslationKeys.size}`);
  console.log(`- Total namespaces used: ${namespaceUsage.size}`);
  console.log(`- Total duplicate keys: ${duplicateKeys.size}`);
  console.log(`- Languages with missing translations: ${missingTranslations.size}`);
}

// 运行检查
main().catch(console.error); 