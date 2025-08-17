import Head from 'next/head';
import { useRouter } from 'next/router';

interface CanonicalUrlProps {
  path?: string;
  noindex?: boolean;
}

export default function CanonicalUrl({ path, noindex = false }: CanonicalUrlProps) {
  const router = useRouter();
  const baseUrl = 'https://soniceai.com';
  
  // 如果没有指定path，使用当前路径
  const canonicalPath = path || router.asPath;
  
  // 移除查询参数和hash
  const cleanPath = canonicalPath.split('?')[0].split('#')[0];
  
  // 构建完整的canonical URL
  const canonicalUrl = `${baseUrl}${cleanPath}`;
  
  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* 添加hreflang标签支持多语言 */}
      <link rel="alternate" hrefLang="zh" href={`${baseUrl}/zh${cleanPath}`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${cleanPath}`} />
      <link rel="alternate" hrefLang="ja" href={`${baseUrl}/ja${cleanPath}`} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      
      {/* 结构化数据标记 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "url": canonicalUrl,
            "mainEntity": {
              "@type": "WebSite",
              "name": "SonicAI",
              "url": baseUrl,
              "description": "发现和探索最佳的人工智能工具"
            }
          })
        }}
      />
    </Head>
  );
} 
