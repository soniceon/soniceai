const fs = require('fs');
const path = require('path');

// 检查页面是否缺少 SEO 组件
function checkMissingSEO() {
  const pagesDir = path.join(__dirname, '../src/pages');
  const files = fs.readdirSync(pagesDir);
  
  const missingSEO = [];
  
  files.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.js')) {
      const filePath = path.join(pagesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 跳过特殊文件
      if (file === '_app.js' || file === '404.tsx' || file === 'sitemap.xml.tsx') {
        return;
      }
      
      // 检查是否包含 SEO 组件
      if (!content.includes('import SEO') && !content.includes('from \'@/components/SEO\'')) {
        missingSEO.push(file);
      }
    }
  });
  
  return missingSEO;
}

// 检查重定向问题
function checkRedirects() {
  const pagesDir = path.join(__dirname, '../src/pages');
  const componentsDir = path.join(__dirname, '../src/components');
  const files = [];
  
  // 收集所有文件
  function collectFiles(dir) {
    if (fs.existsSync(dir)) {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          collectFiles(fullPath);
        } else if (item.endsWith('.tsx') || item.endsWith('.js')) {
          files.push(fullPath);
        }
      });
    }
  }
  
  collectFiles(pagesDir);
  collectFiles(componentsDir);
  
  const redirectIssues = [];
  
  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(path.join(__dirname, '..'), filePath);
    
    // 检查 window.location.href 使用
    if (content.includes('window.location.href')) {
      redirectIssues.push({
        file: relativePath,
        issue: '使用 window.location.href 可能导致重定向问题'
      });
    }
  });
  
  return redirectIssues;
}

// 检查重复文件
function checkDuplicateFiles() {
  const pagesDir = path.join(__dirname, '../src/pages');
  const files = fs.readdirSync(pagesDir);
  
  const duplicates = [];
  const fileMap = new Map();
  
  files.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.js')) {
      const baseName = file.replace(/\.(tsx|js)$/, '');
      if (!fileMap.has(baseName)) {
        fileMap.set(baseName, []);
      }
      fileMap.get(baseName).push(file);
    }
  });
  
  fileMap.forEach((files, baseName) => {
    if (files.length > 1) {
      duplicates.push({
        baseName,
        files
      });
    }
  });
  
  return duplicates;
}

// 检查 robots.txt
function checkRobotsTxt() {
  const robotsPath = path.join(__dirname, '../public/robots.txt');
  if (!fs.existsSync(robotsPath)) {
    return { exists: false, issues: ['robots.txt 文件不存在'] };
  }
  
  const content = fs.readFileSync(robotsPath, 'utf8');
  const issues = [];
  
  if (!content.includes('Sitemap:')) {
    issues.push('缺少 Sitemap 声明');
  }
  
  if (content.includes('Crawl-delay: 10')) {
    issues.push('爬取延迟可能过高');
  }
  
  return { exists: true, issues };
}

// 检查 sitemap
function checkSitemap() {
  const sitemapPath = path.join(__dirname, '../src/pages/sitemap.xml.tsx');
  if (!fs.existsSync(sitemapPath)) {
    return { exists: false, issues: ['sitemap.xml.tsx 文件不存在'] };
  }
  
  const content = fs.readFileSync(sitemapPath, 'utf8');
  const issues = [];
  
  if (!content.includes('aiTools')) {
    issues.push('sitemap 可能没有包含所有工具页面');
  }
  
  return { exists: true, issues };
}

// 检查 404 页面
function check404Page() {
  const notFoundPath = path.join(__dirname, '../src/pages/404.tsx');
  if (!fs.existsSync(notFoundPath)) {
    return { exists: false, issues: ['404.tsx 文件不存在'] };
  }
  
  const content = fs.readFileSync(notFoundPath, 'utf8');
  const issues = [];
  
  if (!content.includes('SEO')) {
    issues.push('404 页面缺少 SEO 组件');
  }
  
  return { exists: true, issues };
}

// 主函数
function main() {
  console.log('🔍 全面 SEO 问题检查报告\n');
  
  // 检查缺少 SEO 组件的页面
  const missingSEO = checkMissingSEO();
  if (missingSEO.length > 0) {
    console.log('❌ 缺少 SEO 组件的页面:');
    missingSEO.forEach(file => {
      console.log(`  - ${file}`);
    });
    console.log('');
  } else {
    console.log('✅ 所有页面都有 SEO 组件\n');
  }
  
  // 检查重定向问题
  const redirectIssues = checkRedirects();
  if (redirectIssues.length > 0) {
    console.log('⚠️ 重定向问题:');
    redirectIssues.forEach(({ file, issue }) => {
      console.log(`  - ${file}: ${issue}`);
    });
    console.log('');
  } else {
    console.log('✅ 没有发现重定向问题\n');
  }
  
  // 检查重复文件
  const duplicates = checkDuplicateFiles();
  if (duplicates.length > 0) {
    console.log('❌ 重复文件问题:');
    duplicates.forEach(({ baseName, files }) => {
      console.log(`  - ${baseName}: ${files.join(', ')}`);
    });
    console.log('');
  } else {
    console.log('✅ 没有发现重复文件\n');
  }
  
  // 检查 robots.txt
  const robotsCheck = checkRobotsTxt();
  if (robotsCheck.exists) {
    if (robotsCheck.issues.length > 0) {
      console.log('⚠️ robots.txt 问题:');
      robotsCheck.issues.forEach(issue => {
        console.log(`  - ${issue}`);
      });
      console.log('');
    } else {
      console.log('✅ robots.txt 配置正常\n');
    }
  } else {
    console.log('❌ robots.txt 文件不存在\n');
  }
  
  // 检查 sitemap
  const sitemapCheck = checkSitemap();
  if (sitemapCheck.exists) {
    if (sitemapCheck.issues.length > 0) {
      console.log('⚠️ sitemap 问题:');
      sitemapCheck.issues.forEach(issue => {
        console.log(`  - ${issue}`);
      });
      console.log('');
    } else {
      console.log('✅ sitemap 配置正常\n');
    }
  } else {
    console.log('❌ sitemap.xml.tsx 文件不存在\n');
  }
  
  // 检查 404 页面
  const notFoundCheck = check404Page();
  if (notFoundCheck.exists) {
    if (notFoundCheck.issues.length > 0) {
      console.log('⚠️ 404 页面问题:');
      notFoundCheck.issues.forEach(issue => {
        console.log(`  - ${issue}`);
      });
      console.log('');
    } else {
      console.log('✅ 404 页面配置正常\n');
    }
  } else {
    console.log('❌ 404.tsx 文件不存在\n');
  }
  
  console.log('📋 建议:');
  console.log('1. 修复所有发现的问题');
  console.log('2. 提交新的 sitemap 到 Google Search Console');
  console.log('3. 请求 Google 重新抓取重要页面');
  console.log('4. 定期运行此检查脚本');
}

main(); 