import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function NotFoundHandler() {
  const router = useRouter();
  const [suggestedPaths, setSuggestedPaths] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const currentPath = router.asPath;
    
    // 分析当前路径，提供建议
    const suggestions: string[] = [];
    
    // 处理工具页面
    if (currentPath.includes('/tools/')) {
      const toolId = currentPath.split('/tools/')[1];
      if (toolId && !toolId.includes('.')) {
        suggestions.push(`/tools/${toolId}`);
      }
      suggestions.push('/tools');
    }
    
    // 处理分类页面
    if (currentPath.includes('/categories/')) {
      const category = currentPath.split('/categories/')[1];
      if (category && !category.includes('.')) {
        suggestions.push(`/categories/${category}`);
      }
      suggestions.push('/categories');
    }
    
    // 处理其他常见路径
    if (currentPath.includes('tools')) {
      suggestions.push('/tools');
    }
    if (currentPath.includes('categories')) {
      suggestions.push('/categories');
    }
    if (currentPath.includes('rankings')) {
      suggestions.push('/rankings');
    }
    if (currentPath.includes('featured')) {
      suggestions.push('/featured');
    }
    
    // 添加通用建议
    suggestions.push('/');
    suggestions.push('/tools');
    suggestions.push('/categories');
    suggestions.push('/rankings');
    suggestions.push('/featured');
    
    // 去重并限制数量
    const uniqueSuggestions = Array.from(new Set(suggestions)).slice(0, 5);
    setSuggestedPaths(uniqueSuggestions);
    setIsAnalyzing(false);
  }, [router.asPath]);

  return (
    <>
      <Head>
        <title>页面未找到 - SoniceAI</title>
        <meta name="description" content="抱歉，您访问的页面不存在。我们为您提供了相关页面的建议。" />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#181825] py-12 px-4">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <div className="text-8xl mb-4">🔍</div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              页面未找到
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              抱歉，您访问的页面 <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                {router.asPath}
              </code> 不存在。
            </p>
          </div>

          {isAnalyzing ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">正在分析页面路径...</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                为您推荐以下页面
              </h2>
              
              <div className="grid gap-4">
                {suggestedPaths.map((path, index) => (
                  <Link
                    key={path}
                    href={path}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-purple-600 dark:text-purple-400 font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {path === '/' ? '首页' : path}
                      </span>
                    </div>
                    <span className="text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      →
                    </span>
                  </Link>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                  或者您可以：
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    返回上一页
                  </button>
                  <Link
                    href="/"
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
                  >
                    返回首页
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              如果您认为这是一个错误，请联系我们的支持团队
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 
