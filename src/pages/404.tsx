import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { aiTools } from '@/data/aiTools';
import SEO from '@/components/SEO';

export default function Custom404() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // 从URL路径中提取可能的搜索词
    const path = router.asPath;
    const pathParts = path.split('/').filter(Boolean);
    
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1];
      setSearchTerm(lastPart);
      
      // 查找相似的工具
      const similarTools = aiTools.filter(tool => {
        const toolName = tool.name.zh || tool.name.en;
        const toolDesc = tool.desc.zh || tool.desc.en;
        const toolTags = tool.tags.join(' ');
        
        const searchLower = lastPart.toLowerCase();
        return toolName.toLowerCase().includes(searchLower) ||
               toolDesc.toLowerCase().includes(searchLower) ||
               toolTags.toLowerCase().includes(searchLower) ||
               tool.type.toLowerCase().includes(searchLower);
      }).slice(0, 6);
      
      setSuggestions(similarTools);
    }
  }, [router.asPath]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/tools?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      <SEO
        title="页面未找到 - SoniceAI"
        description="抱歉，您访问的页面不存在。请使用搜索功能或浏览我们的AI工具分类。"
        type="website"
        section="404页面"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-[#181825] flex items-center justify-center py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* 404图标 */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-purple-600 dark:text-purple-400 mb-4">
              404
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              页面未找到
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              抱歉，您访问的页面不存在或已被移动
            </p>
          </div>

          {/* 搜索框 */}
          <div className="max-w-md mx-auto mb-8">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索AI工具..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
              >
                搜索
              </button>
            </form>
          </div>

          {/* 快速导航 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link
              href="/"
              className="p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-2xl mb-2">🏠</div>
              <div className="font-semibold text-gray-900 dark:text-white">首页</div>
            </Link>
            <Link
              href="/tools"
              className="p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-2xl mb-2">🔧</div>
              <div className="font-semibold text-gray-900 dark:text-white">工具</div>
            </Link>
            <Link
              href="/categories"
              className="p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-2xl mb-2">📁</div>
              <div className="font-semibold text-gray-900 dark:text-white">分类</div>
            </Link>
            <Link
              href="/rankings"
              className="p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-2xl mb-2">🏆</div>
              <div className="font-semibold text-gray-900 dark:text-white">排行榜</div>
            </Link>
          </div>

          {/* 相关建议 */}
          {suggestions.length > 0 && (
            <div className="text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                您可能在寻找：
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    className="block p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center text-2xl">
                        {tool.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {tool.name.zh || tool.name.en}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {tool.desc.zh || tool.desc.en}
                        </p>
                        <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs mt-2">
                          {tool.type}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 联系信息 */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              如果您认为这是一个错误，请联系我们
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                返回首页
              </Link>
              <span className="text-gray-400">|</span>
              <Link
                href="/tools"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                浏览工具
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
