import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';
import { useSearch } from '@/contexts/SearchContext';
import { useRouter } from 'next/router';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const SIDEBAR_WIDTH = 80; // 侧边栏展开宽度(px)

function Logo() {
  return (
    <svg viewBox="0 0 40 40" width={40} height={40} className="rounded-full border bg-white" style={{display:'block'}}>
      <circle cx="20" cy="20" r="19" fill="#fff" stroke="#8b5cf6" strokeWidth="2" />
      <circle cx="20" cy="20" r="18" fill="#fff" />
      <path d="M20,2 a18,18 0 0,1 0,36 a9,9 0 0,0 0,-18 a9,9 0 0,1 0,-18" fill="#22223b" />
      <circle cx="20" cy="10" r="4" fill="#e0f2fe" stroke="#06b6d4" strokeWidth="1.5" />
      <circle cx="20" cy="30" r="4" fill="#22223b" stroke="#8b5cf6" strokeWidth="1.5" />
    </svg>
  );
}

// 新增：多语言菜单项数据
const rankingMenu = [
  {
    icon: '📈',
    title: { zh: 'AI榜', en: 'AI Ranking', ja: 'AIランキング', ko: 'AI 랭킹', de: 'AI-Rangliste', fr: 'Classement IA', es: 'Ranking IA', ru: 'AI Рейтинг' },
    desc: { zh: '依访问量和月榜排序的AI网站榜单', en: 'AI sites ranked by traffic and monthly stats', ja: 'アクセス数・月間ランキング順AIサイト', ko: '트래픽/월간 순위별 AI 사이트', de: 'KI-Seiten nach Traffic/Monat', fr: 'Sites IA classés par trafic/mois', es: 'Sitios IA por tráfico/mes', ru: 'AI сайты по трафику/месяцу' },
    link: '/rankings',
  },
  {
    icon: '📂',
    title: { zh: 'AI分类榜', en: 'Category Ranking', ja: 'カテゴリランキング', ko: '카테고리 랭킹', de: 'Kategorien-Rangliste', fr: 'Classement par catégorie', es: 'Ranking por categoría', ru: 'Рейтинг по категориям' },
    desc: { zh: '依分类和访问量排序的AI榜单', en: 'AI rankings by category and traffic', ja: 'カテゴリ・アクセス数別AIランキング', ko: '카테고리/트래픽별 AI 랭킹', de: 'KI nach Kategorie/Traffic', fr: 'Classement IA par catégorie/trafic', es: 'Ranking IA por categoría/tráfico', ru: 'AI по категориям/трафику' },
    link: '/rankings/categories',
  },
  {
    icon: '🌍',
    title: { zh: 'AI地区榜', en: 'Region Ranking', ja: '地域ランキング', ko: '지역 랭킹', de: 'Regionen-Rangliste', fr: 'Classement régional', es: 'Ranking regional', ru: 'Региональный рейтинг' },
    desc: { zh: '依地区和访问量排序的AI榜单', en: 'AI rankings by region and traffic', ja: '地域・アクセス数別AIランキング', ko: '지역/트래픽별 AI 랭킹', de: 'KI nach Region/Traffic', fr: 'Classement IA par région/trafic', es: 'Ranking IA por región/tráfico', ru: 'AI по регионам/трафику' },
    link: '/rankings/region',
  },
  {
    icon: '🔗',
    title: { zh: 'AI渠道榜', en: 'Channel Ranking', ja: 'チャネルランキング', ko: '채널 랭킹', de: 'Kanal-Rangliste', fr: 'Classement par canal', es: 'Ranking por canal', ru: 'Рейтинг по каналам' },
    desc: { zh: '依来源渠道排序的AI榜单', en: 'AI rankings by source channel', ja: '流入チャネル別AIランキング', ko: '유입채널별 AI 랭킹', de: 'KI nach Kanal', fr: 'Classement IA par canal', es: 'Ranking IA por canal', ru: 'AI по каналам' },
    link: '/rankings/channel',
  },
  {
    icon: '💰',
    title: { zh: 'AI收入榜', en: 'Revenue Ranking', ja: '収益ランキング', ko: '수익 랭킹', de: 'Einnahmen-Rangliste', fr: 'Classement revenus', es: 'Ranking ingresos', ru: 'Рейтинг по доходу' },
    desc: { zh: '依排名和实际流量的AI高收入榜', en: 'AI sites by revenue and real traffic', ja: '収益・実トラフィック順AIランキング', ko: '수익/실트래픽별 AI 랭킹', de: 'KI nach Einnahmen/Traffic', fr: 'Sites IA par revenus/trafic', es: 'Sitios IA por ingresos/tráfico', ru: 'AI по доходу/трафику' },
    link: '/rankings/revenue',
  },
];

const categoryMenu = [
  {
    icon: '✨',
    title: { zh: '最新推出', en: 'New Arrivals', ja: '新着', ko: '최신 출시', de: 'Neuheiten', fr: 'Nouveautés', es: 'Novedades', ru: 'Новинки' },
    desc: { zh: '每日上新AI工具', en: 'Latest AI tools, updated daily', ja: '毎日更新のAI新着', ko: '매일 업데이트되는 AI', de: 'Täglich neue KI-Tools', fr: 'Nouveaux outils IA quotidiens', es: 'Nuevas IA cada día', ru: 'Ежедневные новинки AI' },
    link: '/categories/new',
  },
  {
    icon: '💾',
    title: { zh: '最多保存', en: 'Most Saved', ja: '保存数最多', ko: '가장 많이 저장', de: 'Meist gespeichert', fr: 'Les plus sauvegardés', es: 'Más guardados', ru: 'Самые сохранённые' },
    desc: { zh: '被收藏最多的AI工具', en: 'Most saved AI tools', ja: '最も保存されたAI', ko: '가장 많이 저장된 AI', de: 'Meist gespeicherte KI', fr: 'Outils IA les plus sauvegardés', es: 'IA más guardadas', ru: 'Самые сохранённые AI' },
    link: '/categories/saved',
  },
  {
    icon: '🔥',
    title: { zh: '流量最高', en: 'Top Traffic', ja: 'アクセス最多', ko: '트래픽 최고', de: 'Meist besucht', fr: 'Plus visités', es: 'Más visitados', ru: 'Самые посещаемые' },
    desc: { zh: '访问量最高的AI工具', en: 'AI tools with highest traffic', ja: 'アクセス数最多AI', ko: '트래픽 많은 AI', de: 'KI mit höchstem Traffic', fr: 'Outils IA les plus visités', es: 'IA más visitadas', ru: 'Самые посещаемые AI' },
    link: '/categories/top',
  },
  {
    icon: '📱',
    title: { zh: 'AI Apps', en: 'AI Apps', ja: 'AIアプリ', ko: 'AI 앱', de: 'AI-Apps', fr: 'Apps IA', es: 'Apps IA', ru: 'AI приложения' },
    desc: { zh: '按App分类的AI工具', en: 'AI tools by app category', ja: 'アプリ別AIツール', ko: '앱별 AI', de: 'KI nach App-Kategorie', fr: 'Outils IA par app', es: 'IA por app', ru: 'AI по приложениям' },
    link: '/categories/apps',
  },
  {
    icon: '🧩',
    title: { zh: 'AI插件', en: 'AI Plugins', ja: 'AIプラグイン', ko: 'AI 플러그인', de: 'KI-Plugins', fr: 'Plugins IA', es: 'Plugins IA', ru: 'AI плагины' },
    desc: { zh: '浏览器/谷歌插件AI工具', en: 'AI browser/Google plugins', ja: 'ブラウザ/GoogleプラグインAI', ko: '브라우저/구글 플러그인 AI', de: 'KI-Browser/Google-Plugins', fr: 'Plugins IA navigateur/Google', es: 'Plugins IA navegador/Google', ru: 'AI плагины для браузера/Google' },
    link: '/categories/plugins',
  },
  {
    icon: '🤖',
    title: { zh: 'GPTs', en: 'GPTs', ja: 'GPTs', ko: 'GPTs', de: 'GPTs', fr: 'GPTs', es: 'GPTs', ru: 'GPTs' },
    desc: { zh: 'GPT Store精选AI', en: 'Featured GPT Store AIs', ja: 'GPTストアの注目AI', ko: 'GPT 스토어 추천 AI', de: 'GPT Store KI-Empfehlungen', fr: 'GPT Store IA en vedette', es: 'GPT Store IA destacadas', ru: 'Избранные AI из GPT Store' },
    link: '/categories/gpts',
  },
];

export default function Navbar() {
  const { t } = useTranslation('common');
  const { keyword, setKeyword } = useSearch();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rankingDropdown, setRankingDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const rankingTimeout = useRef<NodeJS.Timeout | null>(null);
  const categoryTimeout = useRef<NodeJS.Timeout | null>(null);
  const [user, setUser] = useState<{ email: string, username: string } | null>(null);
  const [profileDropdown, setProfileDropdown] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail');
      const username = localStorage.getItem('username');
      if (email) setUser({ email, username: username || email });
      else setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    setUser(null);
    router.push('/login');
  };

  // 搜索并跳转首页
  const handleSearch = () => {
    if (router.pathname !== '/') {
      router.push('/').then(() => {
        setTimeout(() => {
          const el = document.getElementById('toolgrid-anchor');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      });
    } else {
      const el = document.getElementById('toolgrid-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 判断当前高亮
  const isActive = (href: string) => router.pathname === href;

  const handleRankingEnter = () => {
    if (rankingTimeout.current) clearTimeout(rankingTimeout.current);
    setRankingDropdown(true);
  };
  const handleRankingLeave = () => {
    rankingTimeout.current = setTimeout(() => setRankingDropdown(false), 300);
  };
  const handleCategoryEnter = () => {
    if (categoryTimeout.current) clearTimeout(categoryTimeout.current);
    setCategoryDropdown(true);
  };
  const handleCategoryLeave = () => {
    categoryTimeout.current = setTimeout(() => setCategoryDropdown(false), 300);
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow flex items-center px-4 md:px-8" style={{ minHeight: 72 }}>
      <div className="flex items-center gap-2 min-w-[180px]" style={{ marginLeft: SIDEBAR_WIDTH }}>
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-bold text-2xl text-purple-700 ml-1">SoniceAI</span>
        </Link>
      </div>
      {/* 桌面导航 居中 */}
      <div className="flex-1 flex justify-center">
        <div className="hidden md:flex gap-6 text-gray-700 dark:text-gray-200 font-medium items-center">
          {/* 排行榜下拉 */}
          <div className="relative"
            onMouseEnter={handleRankingEnter}
            onMouseLeave={handleRankingLeave}
          >
            <button className={`flex items-center gap-1 text-base hover:text-purple-600 ${isActive('/rankings') ? 'text-purple-600 font-bold' : ''}`}> <span className="text-xl">📈</span>{t('navbar_rankings')}</button>
            {rankingDropdown && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 shadow-xl rounded-2xl z-30"
                onMouseEnter={handleRankingEnter}
                onMouseLeave={handleRankingLeave}
              >
                <div className="py-2">
                  {rankingMenu.map(item => (
                    <Link key={item.link} href={item.link} className="flex items-start gap-3 px-5 py-3 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-xl">
                      <span className="text-2xl mt-1">{item.icon}</span>
                      <div>
                        <div className="font-bold text-base">{item.title.zh}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.desc.zh}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* 分类下拉 */}
          <div className="relative"
            onMouseEnter={handleCategoryEnter}
            onMouseLeave={handleCategoryLeave}
          >
            <button className={`flex items-center gap-1 text-base hover:text-purple-600 ${isActive('/categories') ? 'text-purple-600 font-bold' : ''}`}> <span className="text-xl">📂</span>{t('navbar_categories')}</button>
            {categoryDropdown && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 shadow-xl rounded-2xl z-30"
                onMouseEnter={handleCategoryEnter}
                onMouseLeave={handleCategoryLeave}
              >
                <div className="py-2">
                  {categoryMenu.map(item => (
                    <Link key={item.link} href={item.link} className="flex items-start gap-3 px-5 py-3 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-xl">
                      <span className="text-2xl mt-1">{item.icon}</span>
                      <div>
                        <div className="font-bold text-base">{item.title.zh}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.desc.zh}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link href="/tools" className={`hover:text-purple-600 flex items-center gap-1 text-base ${isActive('/tools') ? 'text-purple-600 font-bold' : ''}`}><span className="text-xl">🛠️</span>{t('navbar_tools')}</Link>
          <Link href="/featured" className={`hover:text-purple-600 flex items-center gap-1 text-base ${isActive('/featured') ? 'text-purple-600 font-bold' : ''}`}><span className="text-xl">⭐</span>{t('navbar_featured')}</Link>
        </div>
      </div>
      {/* 移动端汉堡菜单 */}
      <div className="md:hidden ml-auto flex items-center">
        <button onClick={() => setMobileMenuOpen(v => !v)} className="p-2 text-gray-700 dark:text-gray-200">
          <span className="material-icons">menu</span>
        </button>
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg z-50 flex flex-col gap-2 p-4">
            <Link href="/categories" className={`flex items-center gap-2 py-2 ${isActive('/categories') ? 'text-purple-600 font-bold' : ''}`}>{t('navbar_categories')}</Link>
            <Link href="/rankings" className={`flex items-center gap-2 py-2 ${isActive('/rankings') ? 'text-purple-600 font-bold' : ''}`}>{t('navbar_rankings')}</Link>
            <Link href="/tools" className={`flex items-center gap-2 py-2 ${isActive('/tools') ? 'text-purple-600 font-bold' : ''}`}>{t('navbar_tools')}</Link>
            <Link href="/featured" className={`flex items-center gap-2 py-2 ${isActive('/featured') ? 'text-purple-600 font-bold' : ''}`}>{t('navbar_featured')}</Link>
          </div>
        )}
      </div>
      {/* 右侧搜索/主题/语言 */}
      <div className="flex items-center gap-2 min-w-[320px] justify-end ml-auto" style={{ marginRight: 24 }}>
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <input
            className="px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none"
            placeholder={t('navbar_search_placeholder')}
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
          />
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 flex items-center" onClick={handleSearch}>
            <span className="material-icons text-base">{t('navbar_search')}</span>
          </button>
        </div>
        <ThemeToggle />
        <LanguageSwitcher />
        {/* 用户中心/登录注册 */}
        {user ? (
          <div className="relative ml-2">
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              onClick={() => setProfileDropdown(v => !v)}
            >
              Hi, {user.username}
            </button>
            {profileDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-lg z-50">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">个人中心</Link>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                  onClick={handleLogout}
                >退出登录</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="ml-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">{t('navbar_login')}</Link>
            <Link href="/register" className="ml-2 px-4 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-50">{t('navbar_register')}</Link>
          </>
        )}
      </div>
    </nav>
  );
} 