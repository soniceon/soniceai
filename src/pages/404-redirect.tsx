import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function NotFoundRedirect() {
  const router = useRouter();

  useEffect(() => {
    // 获取当前路径
    const currentPath = router.asPath;
    
    // 定义重定向规�?
    const redirectRules: { [key: string]: string } = {
      // 处理.html扩展�?
      '/categories.html': '/categories',
      '/contact.html': '/contact',
      '/about.html': '/about',
      '/tools.html': '/tools',
      
      // 处理重复路径
      '/pages/pages/': '/',
      '/sites/': '/',
      '/tools/tools/': '/tools',
      
      // 处理旧版本路�?
      '/old-tools/': '/tools',
      '/ai-tools/': '/tools',
      
      // 处理查询参数
      '/search?q=': '/tools',
      '/search?query=': '/tools',
      
      // 处理大写路径
      '/Tools': '/tools',
      '/Categories': '/categories',
      '/Rankings': '/rankings',
    };

    // 检查是否需要重定向
    let shouldRedirect = false;
    let redirectPath = '/';

    for (const [pattern, target] of Object.entries(redirectRules)) {
      if (currentPath.includes(pattern) || currentPath === pattern) {
        shouldRedirect = true;
        redirectPath = target;
        break;
      }
    }

    // 如果没有匹配的规则，尝试智能重定�?
    if (!shouldRedirect) {
      // 处理工具页面
      if (currentPath.includes('/tools/') && currentPath.endsWith('.html')) {
        shouldRedirect = true;
        redirectPath = currentPath.replace('.html', '');
      }
      // 处理分类页面
      else if (currentPath.includes('/categories/') && currentPath.endsWith('.html')) {
        shouldRedirect = true;
        redirectPath = currentPath.replace('.html', '');
      }
      // 处理其他.html页面
      else if (currentPath.endsWith('.html')) {
        shouldRedirect = true;
        redirectPath = currentPath.replace('.html', '');
      }
    }

    // 执行重定�?
    if (shouldRedirect) {
      // 301永久重定�?
      window.location.replace(redirectPath);
    } else {
      // 如果没有匹配的规则，重定向到404页面
      router.replace('/404');
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>页面重定向中 - SoniceAI</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#181825]">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            页面重定向中
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            正在为您跳转到正确的页面...
          </p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        </div>
      </div>
    </>
  );
} 
