import Head from 'next/head';
import { useRouter } from 'next/router';

interface SeoOptimizerProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
  canonicalPath?: string;
}

export default function SeoOptimizer({
  title,
  description,
  keywords,
  image = '/og-image.jpg',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  noindex = false,
  canonicalPath
}: SeoOptimizerProps) {
  const router = useRouter();
  const baseUrl = 'https://soniceai.com';
  
  // 构建完整的canonical URL
  const canonicalUrl = canonicalPath 
    ? `${baseUrl}${canonicalPath}`
    : `${baseUrl}${router.asPath.split('?')[0].split('#')[0]}`;
  
  // 构建完整的图片URL
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  
  // 构建完整的标题
  const fullTitle = title.includes('SonicAI') ? title : `${title} | SonicAI`;
  
  return (
    <Head>
      {/* 基本SEO标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author || 'SonicAI'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* 机器人指令 */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Open Graph 标签 */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="SonicAI" />
      <meta property="og:locale" content="zh_CN" />
      
      {/* Twitter Card 标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": type === 'article' ? 'Article' : 'WebPage',
            "headline": fullTitle,
            "description": description,
            "url": canonicalUrl,
            "image": fullImageUrl,
            "publisher": {
              "@type": "Organization",
              "name": "SonicAI",
              "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png`
              }
            },
            "mainEntity": {
              "@type": "WebSite",
              "name": "SonicAI",
              "url": baseUrl,
              "description": "发现和探索最佳的人工智能工具"
            },
            ...(publishedTime && { "datePublished": publishedTime }),
            ...(modifiedTime && { "dateModified": modifiedTime }),
            ...(author && { "author": { "@type": "Person", "name": author } })
          })
        }}
      />
      
      {/* 多语言支持 */}
      <link rel="alternate" hrefLang="zh" href={`${baseUrl}/zh${router.asPath.split('?')[0].split('#')[0]}`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${router.asPath.split('?')[0].split('#')[0]}`} />
      <link rel="alternate" hrefLang="ja" href={`${baseUrl}/ja${router.asPath.split('?')[0].split('#')[0]}`} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      
      {/* 其他重要标签 */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      
      {/* 预连接优化 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS预取 */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
    </Head>
  );
} 