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
  localesPath: path.join(__dirname, '../src/public/locales'),
  // 要检查的语言
  languages: ['en', 'zh'],
  // 要检查的配置文件
  configFiles: [
    'next.config.js',
    'next-i18next.config.js',
    '.env',
    '.env.local'
  ],
  // 翻译 key 配置
  keyConfig: {
    maxLength: 100,
    maxDepth: 5,
    namingPattern: /^[a-z][a-z0-9_]*$/
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
  const validKeyRegex = /^[a-zA-Z0-9_.-]+$/;
  if (!validKeyRegex.test(key)) {
    return false;
  }
  return true;
}

// 检查翻译 key 长度
function checkKeyLength(key) {
  return key.length <= config.keyConfig.maxLength;
}

// 检查翻译 key 命名规范
function checkKeyNamingConvention(key) {
  return config.keyConfig.namingPattern.test(key);
}

// 检查翻译 key 层级深度
function checkKeyDepth(key) {
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

  // 收集所有 key
  Object.values(translations).forEach(namespaces => {
    Object.values(namespaces).forEach(content => {
      const collectKeys = (obj, path = '') => {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
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
      if (!langKeys.has(key)) {
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
    const keyRegex = /t\(['"]([^'"]+)['"]\)/g;
    let match;
    while ((match = keyRegex.exec(content)) !== null) {
      const key = match[1];
      
      // 验证 key 格式
      if (!validateTranslationKey(key)) {
        fileErrors.push(`Invalid translation key format: ${key}`);
      }
      
      // 检查 key 长度
      if (!checkKeyLength(key)) {
        fileWarnings.push(`Translation key too long: ${key}`);
      }
      
      // 检查命名规范
      if (!checkKeyNamingConvention(key)) {
        fileWarnings.push(`Translation key doesn't follow naming convention: ${key}`);
      }
      
      // 检查层级深度
      if (!checkKeyDepth(key)) {
        fileWarnings.push(`Translation key too deep: ${key}`);
      }
      
      fileKeys.add(key);
      translationKeys.add(key);
    }

    // 检查动态翻译 key
    const dynamicKeys = checkDynamicTranslationKeys(content);
    if (dynamicKeys.length > 0) {
      dynamicTranslationKeys.set(filePath, dynamicKeys);
      fileWarnings.push('Using dynamic translation keys - consider using static keys');
    }

    // 检查 HTML 实体
    const entities = checkHtmlEntities(content);
    if (entities.length > 0) {
      htmlEntities.set(filePath, entities);
      fileWarnings.push('Using HTML entities - consider using Unicode characters');
    }

    // 检查是否使用了命名空间
    const namespaceRegex = /useTranslation\(['"]([^'"]+)['"]\)/;
    const namespaceMatch = content.match(namespaceRegex);
    const namespace = namespaceMatch ? namespaceMatch[1] : 'common';

    // 检查是否使用了 ready 状态
    const hasReadyCheck = content.includes('ready') && (
      content.includes('if (!ready)') || 
      content.includes('if (ready === false') ||
      content.includes('!ready ?') ||
      content.includes('ready === false ?') ||
      content.includes('useEffect(() => { if (!ready)') ||
      content.includes('<Suspense') ||
      content.includes('ErrorBoundary')
    );

    if (!hasReadyCheck) {
      fileWarnings.push('Missing ready check before rendering');
    }

    // 检查是否在组件顶部解构 ready
    const hasReadyDestructuring = content.includes('const { t, ready } = useTranslation') ||
                                content.includes('const { t, i18n, ready } = useTranslation');
    if (!hasReadyDestructuring) {
      fileWarnings.push('Missing ready destructuring from useTranslation');
    }

    // 检查是否在渲染前等待 ready
    const hasReadyWait = content.includes('if (!ready) return null') || 
                        content.includes('if (!ready) return <></>') ||
                        content.includes('if (!ready) return <Loading') ||
                        content.includes('if (!ready) return <Suspense') ||
                        content.includes('if (!ready) return <ErrorBoundary');
    if (!hasReadyWait) {
      fileWarnings.push('Missing ready wait before rendering');
    }

    // 检查是否使用了 withTranslation
    const hasWithTranslation = content.includes('withTranslation');
    if (hasWithTranslation) {
      fileWarnings.push('Using withTranslation HOC - consider migrating to useTranslation hook');
    }

    // 检查是否使用了 Trans 组件
    const hasTransComponent = content.includes('<Trans');
    if (hasTransComponent) {
      fileWarnings.push('Using Trans component - ensure proper usage with i18next');
    }

    filesWithTranslations.set(filePath, {
      keys: Array.from(fileKeys),
      namespace,
      hasReadyCheck,
      hasReadyDestructuring,
      hasReadyWait,
      hasWithTranslation,
      hasTransComponent,
      warnings: fileWarnings,
      errors: fileErrors
    });
  }

  // 检查硬编码文本
  if (filePath.endsWith('.json')) {
    const jsonContent = JSON.parse(content);
    checkJsonForHardcodedText(jsonContent, filePath, fileHardcodedTexts);
  } else {
    // 检查 JSX 中的文本
    const textRegex = />([^<>{}]+)</g;
    while ((match = textRegex.exec(content)) !== null) {
      const text = match[1].trim();
      if (text && !text.match(/^[0-9\s.,!?]+$/)) {
        fileHardcodedTexts.add(text);
      }
    }
  }

  if (fileHardcodedTexts.size > 0) {
    hardcodedTexts.set(filePath, Array.from(fileHardcodedTexts));
  }
}

// 检查 JSON 文件中的硬编码文本
function checkJsonForHardcodedText(obj, filePath, hardcodedTexts, prefix = '') {
  Object.entries(obj).forEach(([key, value]) => {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string' && !value.match(/^[0-9\s.,!?]+$/)) {
      hardcodedTexts.add(value);
    } else if (typeof value === 'object' && value !== null) {
      checkJsonForHardcodedText(value, filePath, hardcodedTexts, currentPath);
    }
  });
}

// 检查翻译 key 是否存在
function checkTranslationKeys(translations) {
  translationKeys.forEach(key => {
    config.languages.forEach(lang => {
      if (!translations[lang]) {
        errors.push(`Language ${lang} not found in translations`);
        return;
      }

      // 检查每个命名空间
      Object.entries(translations[lang]).forEach(([namespace, content]) => {
        if (!key.includes('.')) {
          if (!content[key]) {
            errors.push(`Translation key "${key}" not found in ${lang}/${namespace}.json`);
          }
        } else {
          const parts = key.split('.');
          let current = content;
          for (const part of parts) {
            if (!current[part]) {
              errors.push(`Translation key "${key}" not found in ${lang}/${namespace}.json`);
              break;
            }
            current = current[part];
          }
        }
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

// 主函数
async function main() {
  console.log('Starting i18n check...\n');

  // 加载翻译文件
  const translations = loadTranslations();
  console.log('Loaded translation files:', Object.keys(translations).join(', '));

  // 获取所有需要检查的文件
  const files = glob.sync(config.filePatterns, {
    ignore: config.excludeDirs.map(dir => `**/${dir}/**`),
  });

  console.log(`\nFound ${files.length} files to check`);

  // 检查每个文件
  files.forEach(file => {
    checkFile(file);
  });

  // 检查配置文件
  checkConfigFiles();

  // 检查翻译 key
  checkTranslationKeys(translations);

  // 检查命名空间一致性
  checkNamespaceConsistency();

  // 检查重复的翻译 key
  checkDuplicateKeys(translations);

  // 检查翻译完整性
  checkTranslationCompleteness(translations);

  // 检查翻译 key 使用频率
  checkKeyUsageFrequency();

  // 生成报告
  console.log('\n=== i18n Check Report ===\n');

  // 显示使用翻译的文件
  console.log('Files using translations:');
  filesWithTranslations.forEach((info, file) => {
    console.log(`\n${file}:`);
    if (!info.isConfigFile) {
      console.log(`  Namespace: ${info.namespace}`);
      console.log(`  Keys: ${info.keys.join(', ')}`);
      console.log(`  Ready Check: ${info.hasReadyCheck ? '✅' : '❌'}`);
      console.log(`  Ready Destructuring: ${info.hasReadyDestructuring ? '✅' : '❌'}`);
      console.log(`  Ready Wait: ${info.hasReadyWait ? '✅' : '❌'}`);
      if (info.hasWithTranslation) {
        console.log('  ⚠️ Using withTranslation HOC');
      }
      if (info.hasTransComponent) {
        console.log('  ⚠️ Using Trans component');
      }
      if (info.warnings.length > 0) {
        console.log('  Warnings:');
        info.warnings.forEach(warning => console.log(`    - ${warning}`));
      }
      if (info.errors.length > 0) {
        console.log('  Errors:');
        info.errors.forEach(error => console.log(`    - ${error}`));
      }
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
  console.log(`- Files with ready check: ${Array.from(filesWithTranslations.values()).filter(info => info.hasReadyCheck).length}`);
  console.log(`- Files with ready destructuring: ${Array.from(filesWithTranslations.values()).filter(info => info.hasReadyDestructuring).length}`);
  console.log(`- Files with ready wait: ${Array.from(filesWithTranslations.values()).filter(info => info.hasReadyWait).length}`);
  console.log(`- Files with hardcoded texts: ${hardcodedTexts.size}`);
  console.log(`- Files using withTranslation: ${Array.from(filesWithTranslations.values()).filter(info => info.hasWithTranslation).length}`);
  console.log(`- Files using Trans component: ${Array.from(filesWithTranslations.values()).filter(info => info.hasTransComponent).length}`);
  console.log(`- Files with HTML entities: ${htmlEntities.size}`);
  console.log(`- Files with dynamic translation keys: ${dynamicTranslationKeys.size}`);
  console.log(`- Total namespaces used: ${namespaceUsage.size}`);
  console.log(`- Total duplicate keys: ${duplicateKeys.size}`);
  console.log(`- Languages with missing translations: ${missingTranslations.size}`);
}

// 运行检查
main().catch(console.error); 