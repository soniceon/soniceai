const fs = require('fs');
const path = require('path');

const tsFile = path.join(__dirname, '../src/data/aiTools.ts');
const jsonFile = path.join(__dirname, '../src/data/aiTools.json');

const content = fs.readFileSync(tsFile, 'utf-8');
const match = content.match(/export const aiTools:[^=]*=\s*(\[[\s\S]*\]);/);

if (!match) {
  console.error('未找到 aiTools 数组');
  process.exit(1);
}

let arrStr = match[1];
// 去掉最后的分号
if (arrStr.trim().endsWith(';')) arrStr = arrStr.trim().slice(0, -1);

try {
  // 用 eval 解析（仅限本地可信代码）
  const aiTools = eval(arrStr);
  fs.writeFileSync(jsonFile, JSON.stringify(aiTools, null, 2), 'utf-8');
  console.log('已生成 src/data/aiTools.json');
} catch (e) {
  console.error('转换失败:', e);
}
