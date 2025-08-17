import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom500() {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>服务器错误 - SoniceAI</title>
        <meta name="description" content="抱歉，服务器出现了问题。请稍后重试或返回首页。" />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="https://soniceai.com/500" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#181825] py-12 px-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="text-8xl mb-4">⚠️</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            服务器错误
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            抱歉，服务器出现了问题。请稍后重试或返回首页。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              重新加载
            </button>
            <Link
              href="/"
              className="px-8 py-3 border border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-medium"
            >
              返回首页
            </Link>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              如果问题持续存在
            </h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <p>• 请检查您的网络连接</p>
              <p>• 清除浏览器缓存和Cookie</p>
              <p>• 稍后再次尝试访问</p>
              <p>• 如果问题仍然存在，请联系我们的技术支持团队</p>
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
