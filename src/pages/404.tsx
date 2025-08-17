import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Custom404: NextPage = () => {
  const router = useRouter();
  const [suggestedPaths, setSuggestedPaths] = useState<string[]>([]);

  useEffect(() => {
    // 根据当前路径提供建议
    const path = router.asPath;
    const suggestions = [];
    
    if (path.includes('tool') || path.includes('ai')) {
      suggestions.push('/tools', '/categories', '/featured');
    } else if (path.includes('categor') || path.includes('type')) {
      suggestions.push('/categories', '/tools', '/rankings');
    } else if (path.includes('rank') || path.includes('top')) {
      suggestions.push('/rankings', '/tools', '/featured');
    } else {
      suggestions.push('/tools', '/categories', '/rankings', '/featured');
    }
    
    setSuggestedPaths(suggestions);
  }, [router.asPath]);

  return (
    <>
      <Head>
        <title>页面未找到 - 404 | SonicAI</title>
        <meta name="description" content="抱歉，您访问的页面不存在。浏览我们的AI工具库，发现最佳的人工智能工具。" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://soniceai.com/404" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 图标 */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-gray-300 dark:text-gray-600">404</div>
            <div className="text-2xl font-semibold text-gray-600 dark:text-gray-300">页面未找到</div>
          </div>
          
          {/* 错误描述 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              抱歉，页面不存在
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              您访问的页面可能已被移动、删除或从未存在过。
            </p>
          </div>
          
          {/* 建议路径 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              您可能想要访问：
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {suggestedPaths.map((path) => (
                <Link
                  key={path}
                  href={path}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  {path === '/tools' && 'AI工具库'}
                  {path === '/categories' && '工具分类'}
                  {path === '/rankings' && '工具排行'}
                  {path === '/featured' && '精选工具'}
                </Link>
              ))}
            </div>
          </div>
          
          {/* 搜索框 */}
          <div className="mb-8">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索AI工具..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const query = (e.target as HTMLInputElement).value.trim();
                      if (query) {
                        router.push(`/tools?search=${encodeURIComponent(query)}`);
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="搜索AI工具..."]') as HTMLInputElement;
                    const query = input?.value.trim();
                    if (query) {
                      router.push(`/tools?search=${encodeURIComponent(query)}`);
                    }
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  搜索
                </button>
              </div>
            </div>
          </div>
          
          {/* 返回首页 */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回首页
            </Link>
          </div>
          
          {/* 帮助信息 */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>如果您认为这是一个错误，请联系我们的支持团队。</p>
            <p className="mt-2">
              当前路径: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">{router.asPath}</code>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom404; 
