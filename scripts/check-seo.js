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
  const files = fs.readdirSync(pagesDir);
  
  const redirectIssues = [];
  
  files.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.js')) {
      const filePath = path.join(pagesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 检查 window.location.href 使用
      if (content.includes('window.location.href')) {
        redirectIssues.push({
          file,
          issue: '使用 window.location.href 可能导致重定向问题'
        });
      }
    }
  });
  
  return redirectIssues;
}

// 主函数
function main() {
  console.log('🔍 SEO 问题检查报告\n');
  
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
  
  console.log('📋 建议:');
  console.log('1. 为缺少 SEO 组件的页面添加 SEO 组件');
  console.log('2. 将 window.location.href 替换为 router.push');
  console.log('3. 检查并修复所有 404 链接');
  console.log('4. 提交新的 sitemap 到 Google Search Console');
}

main(); 