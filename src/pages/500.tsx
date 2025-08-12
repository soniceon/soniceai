import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom500() {
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>服务器错误 - SoniceAI</title>
        <meta name="description" content="抱歉，服务器出现了问题。请稍后重试或返回首页。" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://soniceai.com/500" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#181825] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">500</h1>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              服务器错误
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              抱歉，服务器出现了问题。我们的技术团队正在努力修复。
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              重新加载页面
            </button>
            
            <Link
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              返回首页
            </Link>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              如果问题持续存在，请联系我们的支持团队
            </p>
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