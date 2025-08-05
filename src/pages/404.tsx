import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '@/components/SEO';

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <SEO 
        title="页面未找到 - SoniceAI" 
        description="抱歉，您访问的页面不存在。"
        noindex={true}
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#181c2a]">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            页面未找到
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            抱歉，您访问的页面不存在或已被移动。
          </p>
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              返回首页
            </Link>
            <button
              onClick={() => router.back()}
              className="block w-full mt-4 text-purple-600 hover:text-purple-700 font-medium"
            >
              返回上一页
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 