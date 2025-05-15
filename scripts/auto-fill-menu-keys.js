const fs = require('fs');
const path = require('path');

const menuKeys = {
  new_arrivals: {
    zh: '最新推出', en: 'New Arrivals', ja: '新着', ko: '최신 출시', de: 'Neuheiten', fr: 'Nouveautés', es: 'Novedades', ru: 'Новинки'
  },
  most_saved: {
    zh: '最多保存', en: 'Most Saved', ja: '最も保存された', ko: '가장 많이 저장됨', de: 'Am meisten gespeichert', fr: 'Les plus enregistrés', es: 'Más guardados', ru: 'Самые сохранённые'
  },
  top_traffic: {
    zh: '流量最高', en: 'Top Traffic', ja: 'トラフィック上位', ko: '트래픽 최고', de: 'Top-Verkehr', fr: 'Trafic le plus élevé', es: 'Mayor tráfico', ru: 'Топ по трафику'
  },
  ai_apps: {
    zh: 'AI应用', en: 'AI Apps', ja: 'AIアプリ', ko: 'AI 앱', de: 'AI-Apps', fr: 'Applications IA', es: 'Apps de IA', ru: 'AI-приложения'
  },
  ai_plugins: {
    zh: 'AI插件', en: 'AI Plugins', ja: 'AIプラグイン', ko: 'AI 플러그인', de: 'AI-Plugins', fr: 'Plugins IA', es: 'Plugins de IA', ru: 'AI-плагины'
  },
  gpts: {
    zh: 'GPTs', en: 'GPTs', ja: 'GPTs', ko: 'GPTs', de: 'GPTs', fr: 'GPTs', es: 'GPTs', ru: 'GPTs'
  }
};

const langs = ['zh', 'en', 'ja', 'ko', 'de', 'fr', 'es', 'ru'];
const baseDir = path.join(__dirname, '../public/locales');

langs.forEach(lang => {
  const file = path.join(baseDir, lang, 'common.json');
  let json = {};
  if (fs.existsSync(file)) {
    json = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  Object.keys(menuKeys).forEach(key => {
    json[key] = menuKeys[key][lang];
  });
  fs.writeFileSync(file, JSON.stringify(json, null, 2), 'utf8');
  console.log(`[${lang}] 已写入菜单 key 多语言`);
});

const esMenuKeys = {
  menu_new_arrivals: "Novedades",
  menu_new_arrivals_desc: "Nuevas herramientas de IA, actualizadas a diario",
  menu_most_saved: "Más guardados",
  menu_most_saved_desc: "Herramientas de IA más guardadas",
  menu_top_traffic: "Mayor tráfico",
  menu_top_traffic_desc: "Herramientas de IA con más tráfico",
  menu_ai_apps: "Apps de IA",
  menu_ai_apps_desc: "Herramientas de IA por categoría de app",
  menu_ai_plugins: "Plugins de IA",
  menu_ai_plugins_desc: "Plugins de IA para navegador/Google",
  menu_gpts: "GPTs",
  menu_gpts_desc: "GPT Store IA destacadas"
};

const esFile = path.join(__dirname, '../public/locales/es/common.json');
let esJson = {};
if (fs.existsSync(esFile)) {
  esJson = JSON.parse(fs.readFileSync(esFile, 'utf8'));
}
Object.keys(esMenuKeys).forEach(key => {
  esJson[key] = esMenuKeys[key];
});
fs.writeFileSync(esFile, JSON.stringify(esJson, null, 2), 'utf8');
console.log('[es] 已自动写入 menu_xxx 多语言内容'); 