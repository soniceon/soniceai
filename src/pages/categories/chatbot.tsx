import { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import SEO from '@/components/SEO';
import { aiTools } from '@/data/aiTools';

export default function ChatbotCategory() {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'zh' | 'en' | 'ja' | 'ko' | 'de' | 'fr' | 'es' | 'ru';
  
  const chatbotTools = aiTools.filter(tool => tool.type === 'chatbot');

  return (
    <>
      <SEO
        title="聊天机器人 - SoniceAI"
        description="探索最好的AI聊天机器人工具"
        keywords="AI聊天机器人, ChatGPT, 对话AI, 自然语言处理"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-[#181825] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('chatbot_category', '聊天机器人')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('chatbot_description', '探索最先进的AI聊天机器人工具')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {chatbotTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {tool.name[lang] || tool.name.en}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {tool.desc[lang] || tool.desc.en}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center text-2xl">
                        {tool.icon}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                      {t('chatbot', '聊天机器人')}
                    </span>
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-semibold">{tool.rating}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-blue-500">👥</span>
                        <span className="font-semibold">{tool.users}</span>
                      </span>
                    </div>
                  </div>

                  {tool.tags && tool.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tool.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4">
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      {t('visit_website', '访问网站')}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 