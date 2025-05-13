import { aiTools } from '@/data/aiTools';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'next-i18next';
const channels = [
  { key: 'official', label: { zh: '官网', en: 'Official', ja: '公式', ko: '공식', de: 'Offiziell', fr: 'Officiel', es: 'Oficial', ru: 'Официальный' }, icon: '🌐' },
  { key: 'plugin', label: { zh: '插件', en: 'Plugin', ja: 'プラグイン', ko: '플러그인', de: 'Plugin', fr: 'Plugin', es: 'Plugin', ru: 'Плагин' }, icon: '🧩' },
  { key: 'api', label: { zh: 'API', en: 'API', ja: 'API', ko: 'API', de: 'API', fr: 'API', es: 'API', ru: 'API' }, icon: '🔗' },
  { key: 'community', label: { zh: '社区', en: 'Community', ja: 'コミュニティ', ko: '커뮤니티', de: 'Community', fr: 'Communauté', es: 'Comunidad', ru: 'Сообщество' }, icon: '👥' },
  { key: 'mobile', label: { zh: '移动端', en: 'Mobile', ja: 'モバイル', ko: '모바일', de: 'Mobil', fr: 'Mobile', es: 'Móvil', ru: 'Мобильный' }, icon: '📱' },
  { key: 'other', label: { zh: '其他', en: 'Other', ja: 'その他', ko: '기타', de: 'Andere', fr: 'Autre', es: 'Otro', ru: 'Другое' }, icon: '🔍' },
];
type LangKey = keyof typeof channels[0]['label'];
type Tool = typeof aiTools[number];
function getChannelTools(channelKey: string, allTools: Tool[]): Tool[] {
  const total = allTools.length;
  if (channelKey === 'official') return allTools.slice(0, Math.ceil(total/6));
  if (channelKey === 'plugin') return allTools.slice(Math.ceil(total/6), Math.ceil(total/3));
  if (channelKey === 'api') return allTools.slice(Math.ceil(total/3), Math.ceil(total/2));
  if (channelKey === 'community') return allTools.slice(Math.ceil(total/2), Math.ceil(total*2/3));
  if (channelKey === 'mobile') return allTools.slice(Math.ceil(total*2/3), Math.ceil(total*5/6));
  return allTools.slice(Math.ceil(total*5/6));
}
export default function ChannelRanking() {
  const { lang } = useLanguage();
  const { t } = useTranslation('common');
  const langKey: LangKey = (Object.keys(channels[0].label).includes(lang) ? lang : 'en') as LangKey;
  return (
    <div className="py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">{t('channel_ranking')}</h1>
      {channels.map(channel => {
        const tools = getChannelTools(channel.key, aiTools);
        if (!tools.length) return null;
        return (
          <div key={channel.key} className="mb-10">
            <div className="flex items-center gap-2 mb-4 text-xl font-semibold">
              <span>{channel.icon}</span>
              <span>{channel.label[langKey]}</span>
              <span className="text-xs text-gray-400">({tools.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tools.map((tool: Tool, idx: number) => (
                <div key={tool.id} className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-lg font-bold">
                    <span>{tool.icon}</span>
                    <span>{tool.name[langKey] || tool.name.en}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">{tool.desc[langKey] || tool.desc.en}</div>
                  <div className="text-xs text-gray-400">⭐ {tool.rating} | 👥 {tool.users}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
} 