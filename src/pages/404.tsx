import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>页面未找到 - SoniceAI</title>
        <meta name="description" content="抱歉，您访问的页面不存在。返回首页探索更多AI工具。" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://soniceai.com/404" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#181825] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              页面未找到
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              抱歉，您访问的页面不存在或已被移动。
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              返回首页
            </Link>
            
            <button
              onClick={() => router.back()}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              返回上一页
            </button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              或者探索我们的热门页面：
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/tools"
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors"
              >
                AI工具
              </Link>
              <Link
                href="/categories"
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors"
              >
                分类浏览
              </Link>
              <Link
                href="/rankings"
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors"
              >
                排行榜
              </Link>
              <Link
                href="/featured"
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors"
              >
                精选推荐
              </Link>
            </div>
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