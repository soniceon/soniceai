require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// 1. 加载本地数据
const aiTools = require('../src/data/aiTools.json');
const reviews = require('../src/data/reviews.json');
const users = require('../src/data/users.json');
const categories = require('../src/data/categories.uuid.json');

// 2. 配置 Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://imwglurmizfepuwoaocp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('错误: 请设置 SUPABASE_SERVICE_ROLE_KEY 环境变量');
  process.exit(1);
}

// 3. 辅助：生成 uuid 并映射旧id到新uuid
function mapWithUuid(arr, key = 'id') {
  const map = {};
  arr.forEach(item => {
    const newId = uuidv4();
    map[item[key]] = newId;
    item.id = newId;
  });
  return map;
}

(async () => {
  // 1. 迁移分类
  let categoryMap = {};
  if (categories && categories.length) {
    categoryMap = {};
    for (const cat of categories) {
      // parent_id 映射
      if (cat.parent_id && categoryMap[cat.parent_id]) {
        cat.parent_id = categoryMap[cat.parent_id];
      }
      const { error } = await supabase.from('categories').insert([cat]);
      if (error) console.error('分类导入失败:', cat, error);
      else console.log('分类导入成功:', cat.id, cat.name.en);
      categoryMap[cat.type] = cat.id;
    }
  }

  // 2. 迁移AI工具
  const toolMap = {};
  for (const tool of aiTools) {
    tool.id = uuidv4();
    if (tool.categories && Array.isArray(tool.categories)) {
      tool.categories = tool.categories.map(catType => categoryMap[catType] || null).filter(Boolean);
    }
    // desc 字段映射为 description，且不传 desc 字段
    const { desc, ...rest } = tool;
    const { error } = await supabase.from('ai_tools').insert([{
      ...rest,
      description: desc,
      created_at: new Date().toISOString()
    }]);
    if (error) console.error('AI工具导入失败:', tool, error);
    else console.log('AI工具导入成功:', tool.id, tool.name.en || tool.name.zh);
    toolMap[tool.name.en || tool.name.zh] = tool.id;
  }

  // 3. 迁移用户
  for (const user of users) {
    if (!user.id) user.id = uuidv4();
    // tokenExpires 字段映射为 token_expires，且不传 tokenExpires 字段
    const { tokenExpires, ...rest } = user;
    const { error } = await supabase.from('users').insert([{
      ...rest,
      token_expires: tokenExpires ? new Date(tokenExpires).toISOString() : null,
      created_at: new Date().toISOString()
    }]);
    if (error) console.error('用户导入失败:', user, error);
    else console.log('用户导入成功:', user.id, user.email);
  }

  // 4. 迁移评论
  for (const review of reviews) {
    review.id = uuidv4();
    if (review.tool_id && toolMap[review.tool_id]) {
      review.tool_id = toolMap[review.tool_id];
    }
    const { error } = await supabase.from('reviews').insert([review]);
    if (error) console.error('评论导入失败:', review, error);
    else console.log('评论导入成功:', review.id, review.user_email);
  }

  // 5. 迁移工具-分类多对多（如有 ai_tool_categories 表）
  if (aiTools[0] && aiTools[0].categories) {
    for (const tool of aiTools) {
      if (Array.isArray(tool.categories)) {
        for (const catId of tool.categories) {
          if (catId) {
            const { error } = await supabase.from('ai_tool_categories').insert([{
              tool_id: tool.id,
              category_id: catId
            }]);
            if (error) console.error('工具-分类关联导入失败:', tool.id, catId, error);
            else console.log('工具-分类关联导入成功:', tool.id, catId);
          }
        }
      }
    }
  }

  process.exit(0);
})();
