const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

// 你的百度翻译API配置
const appid = '20250518002360182';
const key = 'n4PNMzKh0XnPUxl8uxGi';

// 需要翻译的key前缀
const keyPrefixes = [
  // 下拉菜单
  'menu_ranking', 'menu_ranking_desc',
  'menu_category_ranking', 'menu_category_ranking_desc',
  'menu_region_ranking', 'menu_region_ranking_desc',
  'menu_channel_ranking', 'menu_channel_ranking_desc',
  'menu_revenue_ranking', 'menu_revenue_ranking_desc',
  'menu_new_arrivals', 'menu_new_arrivals_desc',
  'menu_most_saved', 'menu_most_saved_desc',
  'menu_top_traffic', 'menu_top_traffic_desc',
  'menu_ai_apps', 'menu_ai_apps_desc',
  'menu_ai_plugins', 'menu_ai_plugins_desc',
  'menu_gpts', 'menu_gpts_desc',
  // 顶部导航栏
  'navbar_rankings', 'navbar_categories', 'navbar_tools', 'navbar_featured',
  'navbar_search', 'navbar_search_placeholder', 'navbar_login', 'navbar_register', 'navbar_profile', 'navbar_logout',
  // 侧边栏
  'sidebar_chatbot', 'sidebar_image', 'sidebar_coding', 'sidebar_productivity', 'sidebar_design', 'sidebar_writing', 'sidebar_media', 'sidebar_marketing', 'sidebar_security',
  'sidebar_categories', 'sidebar_browseTools', 'sidebar_home', 'sidebar_toolCategories', 'sidebar_allCategories',
  // 分类
  'categories_all', 'categories_chatbots', 'categories_imageGeneration', 'categories_codeAssistants', 'categories_contentWriting', 'categories_videoGeneration', 'categories_musicGeneration', 'categories_dataAnalysis'
];

// 语言映射（百度API语言代码）
const langMap = {
  zh: 'zh',
  en: 'en',
  ja: 'jp',
  ru: 'ru',
  de: 'de',
  fr: 'fra',
  es: 'spa',
  ko: 'kor',
  pt: 'pt'
};

const localesDir = path.join(__dirname, 'public', 'locales');
const langs = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());
const fileName = 'common.json';

// 百度翻译API调用
async function baiduTranslate(q, from, to) {
  const salt = Date.now();
  const sign = crypto.createHash('md5').update(appid + q + salt + key).digest('hex');
  const url = 'https://fanyi-api.baidu.com/api/trans/vip/translate';
  try {
    const res = await axios.get(url, {
      params: {
        q,
        from,
        to,
        appid,
        salt,
        sign
      }
    });
    if (res.data && res.data.trans_result && res.data.trans_result[0]) {
      return res.data.trans_result[0].dst;
    }
    return '';
  } catch (e) {
    console.error('翻译失败:', q, from, to, e.message);
    return '';
  }
}

// 主流程
(async () => {
  // 先读取英文包作为源
  const enPath = path.join(localesDir, 'en', fileName);
  const enJson = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

  for (const lang of langs) {
    if (lang === 'en') continue; // 英文包跳过
    const filePath = path.join(localesDir, lang, fileName);
    const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let changed = false;

    for (const key of keyPrefixes) {
      // 只翻译内容为空或为英文的key
      if (!json[key] || json[key] === '' || json[key] === enJson[key]) {
        const from = 'en';
        const to = langMap[lang] || lang;
        const text = enJson[key];
        if (!text) continue;
        console.log(`[${lang}] 翻译 ${key}: ${text}`);
        const translated = await baiduTranslate(text, from, to);
        if (translated) {
          json[key] = translated;
          changed = true;
          console.log(`  => ${translated}`);
        }
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
      console.log(`[${lang}] 已写回 ${filePath}`);
    }
  }
  console.log('全部翻译完成！');
})();
