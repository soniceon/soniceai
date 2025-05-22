import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';

const mockStats = [
  { label: 'dashboard_tools', value: 2 },
  { label: 'dashboard_ads', value: 1 },
  { label: 'dashboard_credits', value: 10 },
];
const mockTools = [
  { name: 'ChatGPT', url: 'https://chat.openai.com', type: 'type_chat', date: '2024-05-01', status: 'status_online' },
  { name: 'Midjourney', url: 'https://midjourney.com', type: 'type_image', date: '2024-05-02', status: 'status_reviewing' },
];
const mockAds = [
  { tool: 'ChatGPT', url: 'https://chat.openai.com/ad', balance: 100, status: 'status_running' },
  { tool: 'Midjourney', url: 'https://midjourney.com/ad', balance: 0, status: 'status_stopped' },
];
const mockPosts = [
  { title: 'post_ai_tools_recommend', url: 'https://blog.ai.com/post1', type: 'type_post', date: '2024-05-01', status: 'status_published' },
  { title: 'post_external_promotion', url: 'https://blog.ai.com/link1', type: 'type_link', date: '2024-05-02', status: 'status_reviewing' },
];
const mockGpts = [
  { name: 'AI写作助手', date: '2024-05-01', status: 'status_online' },
  { name: 'AI翻译官', date: '2024-05-02', status: 'status_reviewing' },
];
const mockSites = [
  { site: 'notion.so', status: 'search_completed', total: 10276, unlocked: 0 },
  { site: 'openai.com', status: 'search_completed', total: 11131, unlocked: 0 },
];
const mockFavorites = [
  { name: 'ChatGPT', url: 'https://chat.openai.com', type: 'type_chat', date: '2024-05-01' },
  { name: 'Midjourney', url: 'https://midjourney.com', type: 'type_image', date: '2024-05-02' },
];
const mockProfile = {
  email: 'soniceono@gmail.com',
  username: 'sonice',
  company: '',
  country: '',
  phone: '',
  city: '',
  address: '',
  vat: '',
};

export default function Dashboard() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuth();
  const [stats] = useState(mockStats);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="flex bg-[#181825] min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8 bg-transparent max-w-6xl mx-auto">
        {/* 个人信息卡片 */}
        <div className="bg-[#232136] rounded-2xl shadow-xl border border-purple-900 p-6 flex items-center gap-6 mb-8 transition hover:shadow-2xl">
          <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email || user.nickname || 'user')}`} alt="avatar" className="w-16 h-16 rounded-full bg-gray-200 shadow-lg" />
          <div>
            <div className="text-lg font-bold mb-1 text-gray-100 flex items-center gap-2"><span className="text-purple-400">👤</span>{user.nickname}</div>
            <div className="text-gray-400 mb-2">{user.email}</div>
            <button className="px-4 py-1 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg text-sm shadow flex items-center gap-2 transition hover:scale-105" onClick={handleLogout}><span className="material-icons text-base">logout</span>{t('logout')}</button>
            <div className="mt-2 text-sm text-gray-400 flex items-center gap-1"><span className="inline-block align-middle">🧾</span>{t('sidebar_orders')}</div>
          </div>
        </div>
        {/* 统计卡片区块 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-4 flex flex-col items-center transition hover:shadow-2xl">
              <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-700 text-transparent bg-clip-text mb-1">{s.value}</div>
              <div className="text-xs text-gray-400">{t(s.label)}</div>
            </div>
          ))}
        </div>
        {/* 业务分区卡片区块 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 我的工具 */}
          <div className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-6 flex flex-col">
            <div className="font-bold text-lg mb-2 text-gray-100 flex items-center justify-between">
              {t('my_tools')}
              <button className="text-xs text-purple-400 hover:underline" onClick={()=>router.push('/dashboard/tools')}>{t('view_more')}</button>
            </div>
            <table className="min-w-full text-sm mb-2">
              <thead>
                <tr className="text-purple-300 border-b border-gray-700">
                  <th>{t('tool')}</th><th>{t('website')}</th><th>{t('type')}</th><th>{t('date')}</th><th>{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {mockTools.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-gray-400 py-4">{t('no_data')}</td></tr>
                ) : (
                  mockTools.slice(0,3).map((row,i)=>(
                    <tr key={i} className="border-t border-gray-700 text-gray-100">
                      <td>{row.name}</td><td><a href={row.url} className="text-purple-400 font-semibold underline" target="_blank" rel="noopener noreferrer">{row.url}</a></td><td>{t(row.type)}</td><td>{row.date}</td><td>{t(row.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* 广告 */}
          <div className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-6 flex flex-col">
            <div className="font-bold text-lg mb-2 text-gray-100 flex items-center justify-between">
              {t('my_ads')}
              <button className="text-xs text-purple-400 hover:underline" onClick={()=>router.push('/dashboard/ads')}>{t('view_more')}</button>
            </div>
            <table className="min-w-full text-sm mb-2">
              <thead>
                <tr className="text-purple-300 border-b border-gray-700">
                  <th>{t('tool')}</th><th>{t('ad_url')}</th><th>{t('ad_balance')}</th><th>{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {mockAds.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-gray-400 py-4">{t('no_data')}</td></tr>
                ) : (
                  mockAds.slice(0,3).map((row,i)=>(
                    <tr key={i} className="border-t border-gray-700 text-gray-100">
                      <td>{row.tool}</td><td><a href={row.url} className="text-purple-400 font-semibold underline" target="_blank" rel="noopener noreferrer">{row.url}</a></td><td>{row.balance}</td><td>{t(row.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* 文章/外链 */}
          <div className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-6 flex flex-col">
            <div className="font-bold text-lg mb-2 text-gray-100 flex items-center justify-between">
              {t('my_posts_links')}
              <button className="text-xs text-purple-400 hover:underline" onClick={()=>router.push('/dashboard/posts')}>{t('view_more')}</button>
            </div>
            <table className="min-w-full text-sm mb-2">
              <thead>
                <tr className="text-purple-300 border-b border-gray-700">
                  <th>{t('title')}</th><th>{t('url')}</th><th>{t('type')}</th><th>{t('date')}</th><th>{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {mockPosts.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-gray-400 py-4">{t('no_data')}</td></tr>
                ) : (
                  mockPosts.slice(0,3).map((row,i)=>(
                    <tr key={i} className="border-t border-gray-700 text-gray-100">
                      <td>{t(row.title)}</td><td><a href={row.url} className="text-purple-400 font-semibold underline" target="_blank" rel="noopener noreferrer">{row.url}</a></td><td>{t(row.type)}</td><td>{row.date}</td><td>{t(row.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* 我的GPTs */}
          <div className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-6 flex flex-col">
            <div className="font-bold text-lg mb-2 text-gray-100 flex items-center justify-between">
              {t('my_gpts')}
              <button className="text-xs text-purple-400 hover:underline" onClick={()=>router.push('/dashboard/gpts')}>{t('view_more')}</button>
            </div>
            <table className="min-w-full text-sm mb-2">
              <thead>
                <tr className="text-purple-300 border-b border-gray-700">
                  <th>{t('gpt_name')}</th><th>{t('date')}</th><th>{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {mockGpts.length === 0 ? (
                  <tr><td colSpan={3} className="text-center text-gray-400 py-4">{t('no_data')}</td></tr>
                ) : (
                  mockGpts.slice(0,3).map((row,i)=>(
                    <tr key={i} className="border-t border-gray-700 text-gray-100">
                      <td>{row.name}</td><td>{row.date}</td><td>{t(row.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* 社交媒体聆听 */}
          <div className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-6 flex flex-col">
            <div className="font-bold text-lg mb-2 text-gray-100 flex items-center justify-between">
              {t('listening_sites')}
              <button className="text-xs text-purple-400 hover:underline" onClick={()=>router.push('/dashboard/listening')}>{t('view_more')}</button>
            </div>
            <table className="min-w-full text-sm mb-2">
              <thead>
                <tr className="text-purple-300 border-b border-gray-700">
                  <th>{t('site')}</th><th>{t('search_status')}</th><th>{t('total_data')}</th><th>{t('unlocked')}</th>
                </tr>
              </thead>
              <tbody>
                {mockSites.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-gray-400 py-4">{t('no_data')}</td></tr>
                ) : (
                  mockSites.slice(0,3).map((row,i)=>(
                    <tr key={i} className="border-t border-gray-700 text-gray-100">
                      <td>{row.site}</td><td>{t(row.status)}</td><td>{row.total}</td><td>{row.unlocked}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* 收藏 */}
          <div className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-6 flex flex-col">
            <div className="font-bold text-lg mb-2 text-gray-100 flex items-center justify-between">
              {t('my_favorites')}
              <button className="text-xs text-purple-400 hover:underline" onClick={()=>router.push('/dashboard/favorites')}>{t('view_more')}</button>
            </div>
            <table className="min-w-full text-sm mb-2">
              <thead>
                <tr className="text-purple-300 border-b border-gray-700">
                  <th>{t('tool')}</th><th>{t('website')}</th><th>{t('type')}</th><th>{t('date')}</th>
                </tr>
              </thead>
              <tbody>
                {mockFavorites.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-gray-400 py-4">{t('no_data')}</td></tr>
                ) : (
                  mockFavorites.slice(0,3).map((row,i)=>(
                    <tr key={i} className="border-t border-gray-700 text-gray-100">
                      <td>{row.name}</td><td><a href={row.url} className="text-purple-400 font-semibold underline" target="_blank" rel="noopener noreferrer">{row.url}</a></td><td>{t(row.type)}</td><td>{row.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}; 