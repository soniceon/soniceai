import { useRouter } from 'next/router';
import { useLanguage } from '@/contexts/LanguageContext';
import { aiTools } from '@/data/aiTools';
import { useState } from 'react';
import Link from 'next/link';

const chatgptDetail = {
  launchDate: 'November 2022',
  company: 'OpenAI',
  website: 'https://chat.openai.com',
  users: '100M+',
  responseTime: '<1s',
  features: {
    zh: [
      '自然语言理解',
      '上下文感知对话',
      '多语言支持',
      '可定制的人格和语气',
      '与消息平台集成',
      '从历史交互中学习'
    ],
    en: [
      'Natural language understanding',
      'Context-aware conversations',
      'Multilingual support',
      'Customizable personality and tone',
      'Integration with messaging platforms',
      'Learning from historical interactions'
    ],
    ja: ['自然言語理解', 'コンテキスト認識会話', '多言語対応', 'カスタマイズ可能な人格とトーン', 'メッセージングプラットフォームとの統合', '履歴からの学習'],
    ko: ['자연어 이해', '상황 인식 대화', '다국어 지원', '맞춤형 성격 및 어조', '메시징 플랫폼과 통합', '이력에서 학습'],
    de: ['Verständnis natürlicher Sprache', 'Kontextbewusste Gespräche', 'Mehrsprachige Unterstützung', 'Anpassbare Persönlichkeit und Tonalität', 'Integration mit Messaging-Plattformen', 'Lernen aus historischen Interaktionen'],
    fr: ['Compréhension du langage naturel', 'Conversations contextuelles', 'Support multilingue', 'Personnalité et ton personnalisables', 'Intégration avec les plateformes de messagerie', 'Apprentissage à partir des interactions passées'],
    es: ['Comprensión del lenguaje natural', 'Conversaciones con conciencia de contexto', 'Soporte multilingüe', 'Personalidad y tono personalizables', 'Integración con plataformas de mensajería', 'Aprendizaje de interacciones históricas'],
    ru: ['Понимание естественного языка', 'Контекстно-осознанные беседы', 'Многоязычная поддержка', 'Настраиваемая личность и тон', 'Интеграция с мессенджерами', 'Обучение на основе истории взаимодействий']
  },
  pricing: [
    {
      name: 'Free',
      price: '$0',
      features: {
        zh: ['自然语言理解', '上下文感知对话', '多语言支持'],
        en: ['Natural language understanding', 'Context-aware conversations', 'Multilingual support'],
        ja: ['自然言語理解', 'コンテキスト認識会話', '多言語対応'],
        ko: ['자연어 이해', '상황 인식 대화', '다국어 지원'],
        de: ['Verständnis natürlicher Sprache', 'Kontextbewusste Gespräche', 'Mehrsprachige Unterstützung'],
        fr: ['Compréhension du langage naturel', 'Conversations contextuelles', 'Support multilingue'],
        es: ['Comprensión del lenguaje natural', 'Conversaciones con conciencia de contexto', 'Soporte multilingüe'],
        ru: ['Понимание естественного языка', 'Контекстно-осознанные беседы', 'Многоязычная поддержка']
      },
      cta: 'Get Started'
    },
    {
      name: 'Pro',
      price: '$29/month',
      features: {
        zh: ['自然语言理解', '上下文感知对话', '多语言支持', '可定制的人格和语气'],
        en: ['Natural language understanding', 'Context-aware conversations', 'Multilingual support', 'Customizable personality and tone'],
        ja: ['自然言語理解', 'コンテキスト認識会話', '多言語対応', 'カスタマイズ可能な人格とトーン'],
        ko: ['자연어 이해', '상황 인식 대화', '다국어 지원', '맞춤형 성격 및 어조'],
        de: ['Verständnis natürlicher Sprache', 'Kontextbewusste Gespräche', 'Mehrsprachige Unterstützung', 'Anpassbare Persönlichkeit und Tonalität'],
        fr: ['Compréhension du langage naturel', 'Conversations contextuelles', 'Support multilingue', 'Personnalité et ton personnalisables'],
        es: ['Comprensión del lenguaje natural', 'Conversaciones con conciencia de contexto', 'Soporte multilingüe', 'Personalidad y tono personalizables'],
        ru: ['Понимание естественного языка', 'Контекстно-осознанные беседы', 'Многоязычная поддержка', 'Настраиваемая личность и тон']
      },
      cta: 'Upgrade'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: {
        zh: ['全部功能', '高级支持', '定制集成'],
        en: ['All features', 'Premium support', 'Custom integration'],
        ja: ['全機能', 'プレミアムサポート', 'カスタム統合'],
        ko: ['모든 기능', '프리미엄 지원', '맞춤형 통합'],
        de: ['Alle Funktionen', 'Premium-Support', 'Individuelle Integration'],
        fr: ['Toutes les fonctionnalités', 'Support premium', 'Intégration personnalisée'],
        es: ['Todas las funciones', 'Soporte premium', 'Integración personalizada'],
        ru: ['Все функции', 'Премиум поддержка', 'Индивидуальная интеграция']
      },
      cta: 'Contact Sales'
    }
  ]
};

export default function ToolDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { lang } = useLanguage();
  const tool = aiTools.find(t => t.id === id) || aiTools[0];
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const langKey = (['zh','en','ja','ko','de','fr','es','ru'].includes(lang) ? lang : 'en') as keyof typeof chatgptDetail.features;

  return (
    <div className="flex justify-center w-full">
      <main className="max-w-7xl w-full px-4 py-8">
        {/* 顶部卡片 */}
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-xl bg-purple-200 flex items-center justify-center text-3xl font-bold text-purple-700 overflow-hidden relative">
              <img
                src={`https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(tool.website)}`}
                alt={tool.name[lang]}
                className="w-12 h-12"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
                {tool.icon || tool.name[lang][0]}
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{tool.name[lang]}</div>
              <div className="text-gray-500 dark:text-gray-300 text-sm mt-1">Chatbots</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-500">★</span>
                <span className="font-bold">{tool.rating}</span>
                <span className="text-gray-400 text-xs">{tool.users}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-center">
            {tool.website ? (
              <Link href={tool.website} target="_blank" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-center">Visit Website</Link>
            ) : (
              <button className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed" disabled>官网暂未提供</button>
            )}
          </div>
        </div>

        {/* 概览和侧栏 */}
        <div className="flex gap-6 mb-8 w-full">
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <div className="font-bold text-lg mb-2">Overview</div>
            <div className="text-gray-700 dark:text-gray-200 mb-2">{tool.desc[lang]}</div>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 text-sm space-y-1">
              {chatgptDetail.features[langKey]?.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
          <div className="w-64 flex-shrink-0 flex flex-col gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
              <div className="font-bold mb-2">Quick Info</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Launched: {chatgptDetail.launchDate}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Company: {chatgptDetail.company}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Website: <a href={chatgptDetail.website} className="underline" target="_blank">{chatgptDetail.website}</a></div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Users: {chatgptDetail.users}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Response Time: {chatgptDetail.responseTime}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
              <div className="font-bold mb-2">Share</div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-black text-white rounded">Twitter</button>
                <button className="px-3 py-1 bg-black text-white rounded">Facebook</button>
              </div>
            </div>
          </div>
        </div>

        {/* 定价计划 */}
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-8">
          <div className="font-bold text-lg mb-4">Pricing Plans</div>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            {chatgptDetail.pricing.map((plan, idx) => (
              <div key={idx} className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 flex flex-col items-start border border-gray-200 dark:border-gray-700">
                <div className="font-bold text-lg mb-2">{plan.name}</div>
                <div className="text-purple-700 dark:text-purple-300 font-bold mb-2">{plan.price}</div>
                <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {plan.features[langKey]?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                <button className="mt-auto px-4 py-2 bg-black text-white rounded">{plan.cta}</button>
              </div>
            ))}
          </div>
        </div>

        {/* 评分与评论 */}
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-8">
          <div className="font-bold text-lg mb-4">Ratings & Reviews</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-500 text-2xl">★</span>
            <span className="text-xl font-bold">{tool.rating}</span>
            <span className="text-gray-400 text-sm">({tool.users} users)</span>
          </div>
          <div className="mb-2">Rate this tool</div>
          <div className="flex gap-1 mb-2">
            {[1,2,3,4,5].map(star => (
              <span
                key={star}
                className={`cursor-pointer text-2xl ${userRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                onClick={() => setUserRating(star)}
              >★</span>
            ))}
          </div>
          <textarea
            className="w-full border rounded p-2 mb-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            placeholder="Share your experience with this tool (optional)"
            value={review}
            onChange={e => setReview(e.target.value)}
          />
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">Submit Review</button>
        </div>
      </main>
    </div>
  );
} 