import React from 'react';
import Link from 'next/link';
import { FiMessageSquare, FiImage, FiCode, FiFileText, FiVideo, FiMusic, FiDatabase } from 'react-icons/fi';
import { useTranslation } from 'next-i18next';

const CategoryGrid = () => {
  const { t } = useTranslation('common');
  const categories = [
    {
      id: 'chatbots',
      name: t('auto_ai_chatbots_389695'),
      icon: <FiMessageSquare className="w-6 h-6" />,
      count: 235,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'image-generation',
      name: t('auto_image_generation_c7a4b1'),
      icon: <FiImage className="w-6 h-6" />,
      count: 182,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'code-assistants',
      name: t('auto_code_assistants_c79460'),
      icon: <FiCode className="w-6 h-6" />,
      count: 147,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'content-writing',
      name: t('auto_content_writing_c9ca46'),
      icon: <FiFileText className="w-6 h-6" />,
      count: 168,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'video-generation',
      name: t('auto_video_generation_4617ec'),
      icon: <FiVideo className="w-6 h-6" />,
      count: 93,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'music-generation',
      name: t('auto_music_generation_1a25e6'),
      icon: <FiMusic className="w-6 h-6" />,
      count: 51,
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'data-analysis',
      name: t('auto_data_analysis_323d6a'),
      icon: <FiDatabase className="w-6 h-6" />,
      count: 79,
      color: 'from-indigo-500 to-indigo-600'
    }
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.id}`}
          className="group relative overflow-hidden rounded-lg bg-gray-800 p-6 hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${category.color}`}>
              {category.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{category.name}</h3>
              <p className="text-sm text-gray-400">{category.count} tools</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;