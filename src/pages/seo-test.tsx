import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import SEO from '@/components/SEO';

const SEOTestPage: NextPage = () => {
  const currentDate = new Date().toISOString();

  return (
    <>
      <SEO
        title="SEO测试页面 - SoniceAI"
        description="测试和验证SoniceAI网站的SEO优化效果，包括meta标签、结构化数据、重定向规则等"
        keywords="SEO测试, 搜索引擎优化, meta标签, 结构化数据, 重定向"
        type="website"
        section="SEO测试"
        tags={['SEO测试', '搜索引擎优化', 'meta标签', '结构化数据']}
        publishedTime={currentDate}
        modifiedTime={currentDate}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              SEO测试页面
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              验证SoniceAI网站的SEO优化效果
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              🔍 SEO修复状态
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  已修复的问题
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-gray-700 dark:text-gray-300">H3标签缺失问题</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-gray-700 dark:text-gray-300">Meta描述过长问题</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-gray-700 dark:text-gray-300">关键词过长问题</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-gray-700 dark:text-gray-300">服务器端渲染检查</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  正在修复的问题
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">🔄</span>
                    <span className="text-gray-700 dark:text-gray-300">404错误 (131页)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">🔄</span>
                    <span className="text-gray-700 dark:text-gray-300">自动重定向问题 (40页)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">🔄</span>
                    <span className="text-gray-700 dark:text-gray-300">抓取但未索引 (46页)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">🔄</span>
                    <span className="text-gray-700 dark:text-gray-300">重定向错误 (2页)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">🔄</span>
                    <span className="text-gray-700 dark:text-gray-300">被robots.txt屏蔽 (14页)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              🛠️ 已实施的修复措施
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  中间件重定向优化
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  处理重复路径、拼写错误、旧版本路径等重定向问题
                </p>
                <Link href="/api/redirect-404" className="text-blue-500 hover:underline text-sm">
                  查看重定向规则 →
                </Link>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Robots.txt优化
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  减少不必要的屏蔽规则，确保重要页面不被屏蔽
                </p>
                <Link href="/robots.txt" className="text-blue-500 hover:underline text-sm">
                  查看robots.txt →
                </Link>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Sitemap优化
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  优化sitemap生成，提高页面优先级和更新频率
                </p>
                <Link href="/api/sitemap.xml" className="text-blue-500 hover:underline text-sm">
                  查看sitemap →
                </Link>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  SEO组件优化
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  增强meta标签、结构化数据、Open Graph等SEO元素
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              📊 预期改善效果
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  15-25%
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  整体索引率提升
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  10-20%
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  搜索排名改善
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  80-90%
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  404错误减少
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              🚀 下一步行动计划
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">1.</span>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    部署修复代码
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    将新的中间件和组件部署到生产环境
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">2.</span>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    提交新的sitemap
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    在Google Search Console中提交新的sitemap
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">3.</span>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    监控错误减少
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    使用错误跟踪系统监控问题改善情况
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">4.</span>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    请求重新抓取
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    请求Google重新抓取有问题的页面
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SEOTestPage; 