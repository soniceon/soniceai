const fs = require('fs');
const path = require('path');

const langs = ['en', 'zh', 'ja', 'ko', 'de', 'fr', 'es', 'ru'];
const baseDir = path.join(__dirname, '../public/locales');

const keys = {
  menu_new_arrivals: {
    en: "New Arrivals", zh: "最新推出", ja: "新着", ko: "최신 출시", de: "Neuheiten", fr: "Nouveautés", es: "Novedades", ru: "Новинки"
  },
  menu_new_arrivals_desc: {
    en: "Latest AI tools, updated daily", zh: "每日上新AI工具", ja: "毎日更新の最新AIツール", ko: "매일 업데이트되는 최신 AI 도구", de: "Neueste KI-Tools, täglich aktualisiert", fr: "Derniers outils IA, mis à jour quotidiennement", es: "Nuevas herramientas de IA, actualizadas a diario", ru: "Последние ИИ-инструменты, обновляются ежедневно"
  },
  menu_most_saved: {
    en: "Most Saved", zh: "最多保存", ja: "最も保存された", ko: "가장 많이 저장됨", de: "Am meisten gespeichert", fr: "Les plus enregistrés", es: "Más guardados", ru: "Самые сохранённые"
  },
  menu_most_saved_desc: {
    en: "Most saved AI tools", zh: "被收藏最多的AI工具", ja: "最も保存されたAIツール", ko: "가장 많이 저장된 AI 도구", de: "Meistgespeicherte KI-Tools", fr: "Outils IA les plus enregistrés", es: "Herramientas de IA más guardadas", ru: "Самые сохранённые ИИ-инструменты"
  },
  menu_top_traffic: {
    en: "Top Traffic", zh: "流量最高", ja: "トラフィック上位", ko: "트래픽 최고", de: "Top-Verkehr", fr: "Trafic le plus élevé", es: "Mayor tráfico", ru: "Топ по трафику"
  },
  menu_top_traffic_desc: {
    en: "AI tools with highest traffic", zh: "访问量最高的AI工具", ja: "最もアクセスの多いAIツール", ko: "방문자가 가장 많은 AI 도구", de: "KI-Tools mit dem meisten Traffic", fr: "Outils IA avec le plus de trafic", es: "Herramientas de IA con más tráfico", ru: "ИИ-инструменты с наибольшим трафиком"
  },
  menu_ai_apps: {
    en: "AI Apps", zh: "AI应用", ja: "AIアプリ", ko: "AI 앱", de: "AI-Apps", fr: "Applications IA", es: "Apps de IA", ru: "AI-приложения"
  },
  menu_ai_apps_desc: {
    en: "AI tools by app category", zh: "按App分类的AI工具", ja: "アプリ別AIツール", ko: "앱별 AI 도구", de: "KI-Tools nach App-Kategorie", fr: "Outils IA par catégorie d'application", es: "Herramientas de IA por categoría de app", ru: "ИИ-инструменты по категориям приложений"
  },
  menu_ai_plugins: {
    en: "AI Plugins", zh: "AI插件", ja: "AIプラグイン", ko: "AI 플러그인", de: "AI-Plugins", fr: "Plugins IA", es: "Plugins de IA", ru: "AI-плагины"
  },
  menu_ai_plugins_desc: {
    en: "AI browser/Google plugins", zh: "浏览器/谷歌插件AI工具", ja: "AIブラウザ/Googleプラグイン", ko: "브라우저/구글 플러그인 AI", de: "KI-Browser/Google-Plugins", fr: "Plugins IA navigateur/Google", es: "Plugins de IA para navegador/Google", ru: "ИИ-плагины для браузера/Google"
  },
  menu_gpts: {
    en: "GPTs", zh: "GPTs", ja: "GPTs", ko: "GPTs", de: "GPTs", fr: "GPTs", es: "GPTs", ru: "GPTs"
  },
  menu_gpts_desc: {
    en: "Featured GPT Store AIs", zh: "GPT Store精选AI", ja: "GPTストアおすすめAI", ko: "GPT Store 추천 AI", de: "Empfohlene GPT Store AIs", fr: "GPT Store IA en vedette", es: "GPT Store IA destacadas", ru: "Рекомендуемые GPT Store ИИ"
  }
};

langs.forEach(lang => {
  const file = path.join(baseDir, lang, 'common.json');
  let json = {};
  if (fs.existsSync(file)) {
    json = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  Object.keys(keys).forEach(key => {
    json[key] = keys[key][lang];
  });
  fs.writeFileSync(file, JSON.stringify(json, null, 2), 'utf8');
  console.log(`[${lang}] 强制覆盖写入 menu_xxx 多语言内容`);
});
console.log('所有语言 menu_xxx key 已强制覆盖写入完成！'); 