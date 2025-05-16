import React from 'react';
import Link from 'next/link';
import { FiStar, FiArrowRight } from 'react-icons/fi';
import { useTranslation } from 'next-i18next';

const PopularTools = () => {
  const { t } = useTranslation('common');
  const popularTools = [
    {
      id: 'chatgpt',
      name: t('auto_chatgpt_62239e'),
      description: t('auto_advanced_ai_chatbot_that_can_u_4ca867'),
      rating: 4.9,
      category: 'chatbots',
      image: '/images/chatgpt.png'
    },
    {
      id: 'midjourney',
      name: t('auto_midjourney_91d803'),
      description: t('auto_ai_art_generator_that_creates__4ab3bf'),
      rating: 4.8,
      category: 'image-generation',
      image: '/images/midjourney.png'
    },
    {
      id: 'github-copilot',
      name: t('auto_github_copilot_28ca71'),
      description: t('auto_ai_pair_programmer_that_helps__dfd7f4'),
      rating: 4.7,
      category: 'code-assistants',
      image: '/images/github-copilot.png'
    },
    {
      id: 'dall-e',
      name: t('auto_dall_e_5075e2'),
      description: "OpenAI's image generation system that creates realistic images and art from text descriptions.",
      rating: 4.6,
      category: 'image-generation',
      image: '/images/dall-e.png'
    },
    {
      id: 'jasper',
      name: t('auto_jasper_dc0cc2'),
      description: 'AI content assistant that helps create marketing copy, blog posts, and other written content.',
      rating: 4.5,
      category: 'content-writing',
      image: '/images/jasper.png'
    },
    {
      id: 'runwayml',
      name: t('auto_runwayml_13144c'),
      description: t('auto_creative_suite_for_ai_generate_6ed1c9'),
      rating: 4.4,
      category: 'video-generation',
      image: '/images/runwayml.png'
    }
  ];
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{t('auto_popular_ai_tools_ab5ec9')}</h2>
        <Link href="/tools" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
          View all <FiArrowRight />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularTools.map((tool: {
          id: string;
          name: string;
          description: string;
          rating: number;
          category: string;
          image: string;
        }) => (
          <Link key={tool.id} href={`/tool/${tool.id}`}>
            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    {/* You can add actual images here */}
                    <span className="text-2xl">{tool.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                    <div className="flex items-center mt-1">
                      <FiStar className="w-4 h-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-400">{tool.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-400 line-clamp-2">{tool.description}</p>
              <div className="mt-4">
                <span className="inline-block px-2 py-1 text-xs font-medium text-gray-400 bg-gray-700 rounded">
                  {tool.category}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularTools; 