const { createClient } = require('@supabase/supabase-js');
const categories = require('../src/data/categories.json');

// 推荐用 service_role key，anon key如无RLS也可
const supabase = createClient(
  'https://imwglurmizfepuwoaocp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltd2dsdXJtaXpmZXB1d29hb2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2OTQ0MzcsImV4cCI6MjA2MjI3MDQzN30.svHNSotqwhQ1NZW-kY5w4J06hVApc5jMb2-XLY4CLfM'
);

(async () => {
  for (const cat of categories) {
    // parent_id 为空时需为 null
    if (cat.parent_id === undefined) cat.parent_id = null;
    const { error } = await supabase.from('categories').insert([cat]);
    if (error) {
      console.error('导入失败:', cat, error);
    } else {
      console.log('导入成功:', cat.id, cat.name.en);
    }
  }
  process.exit(0);
})();
