import { aiTools } from '@/data/aiTools';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'next-i18next';
const regions = [
  { key: 'america', label: { zh: '美洲', en: 'America', ja: 'アメリカ', ko: '아메리카', de: 'Amerika', fr: 'Amérique', es: 'América', ru: 'Америка' }, icon: '🌎' },
  { key: 'europe', label: { zh: '欧洲', en: 'Europe', ja: 'ヨーロッパ', ko: '유럽', de: 'Europa', fr: 'Europe', es: 'Europa', ru: 'Европа' }, icon: '🌍' },
  { key: 'asia', label: { zh: '亚洲', en: 'Asia', ja: 'アジア', ko: '아시아', de: 'Asien', fr: 'Asie', es: 'Asia', ru: 'Азия' }, icon: '🌏' },
  { key: 'other', label: { zh: '其他', en: 'Other', ja: 'その他', ko: '기타', de: 'Andere', fr: 'Autre', es: 'Otro', ru: 'Другое' }, icon: '🌐' },
];
type LangKey = keyof typeof regions[0]['label'];
type Tool = typeof aiTools[number];
// 随机分配工具到地区
function getRegionTools(regionKey: string, allTools: Tool[]): Tool[] {
  const total = allTools.length;
  if (regionKey === 'america') return allTools.slice(0, Math.ceil(total/4));
  if (regionKey === 'europe') return allTools.slice(Math.ceil(total/4), Math.ceil(total/2));
  if (regionKey === 'asia') return allTools.slice(Math.ceil(total/2), Math.ceil(total*3/4));
  return allTools.slice(Math.ceil(total*3/4));
}
export default function RegionRanking() {
  const { lang } = useLanguage();
  const { t } = useTranslation('common');
  const langKey: LangKey = (Object.keys(regions[0].label).includes(lang) ? lang : 'en') as LangKey;
  return (
    <div className="py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">{t('region_ranking')}</h1>
      {regions.map(region => {
        const tools = getRegionTools(region.key, aiTools);
        if (!tools.length) return null;
        return (
          <div key={region.key} className="mb-10">
            <div className="flex items-center gap-2 mb-4 text-xl font-semibold">
              <span>{region.icon}</span>
              <span>{region.label[langKey]}</span>
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