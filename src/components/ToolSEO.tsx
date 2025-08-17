import Head from 'next/head';
import { useRouter } from 'next/router';
import { AiTool } from '@/data/aiTools';

interface ToolSEOProps {
  tool: AiTool;
  lang?: string;
}

export default function ToolSEO({ tool, lang = 'en' }: ToolSEOProps) {
  const router = useRouter();
  
  // 确保URL规范化，移除www前缀
  const baseUrl = 'https://soniceai.com';
  const canonicalPath = `/tools/${tool.id}`;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  
  // 多语言规范标记
  const alternateUrls = {
    'en': `${baseUrl}/en${canonicalPath}`,
    'zh': `${baseUrl}/zh${canonicalPath}`,
    'ja': `${baseUrl}/ja${canonicalPath}`,
    'ko': `${baseUrl}/ko${canonicalPath}`,
    'de': `${baseUrl}/de${canonicalPath}`,
    'fr': `${baseUrl}/fr${canonicalPath}`,
    'es': `${baseUrl}/es${canonicalPath}`,
    'ru': `${baseUrl}/ru${canonicalPath}`,
    'pt': `${baseUrl}/pt${canonicalPath}`,
  };

  const toolName = tool.name[lang as keyof typeof tool.name] || tool.name.en;
  const toolDescription = tool.desc[lang as keyof typeof tool.desc] || tool.desc.en;

  return (
    <Head>
      {/* 基础SEO */}
      <title>{`${toolName} - AI工具详情 - SoniceAI`}</title>
      <meta name="description" content={toolDescription} />
      <meta name="keywords" content={`${toolName}, AI工具, ${tool.type}, 人工智能, 机器学习`} />
      
      {/* 规范标记 - 解决重复网页问题 */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* 多语言规范标记 */}
      {Object.entries(alternateUrls).map(([locale, url]) => (
        <link 
          key={locale}
          rel="alternate" 
          hrefLang={locale} 
          href={url} 
        />
      ))}
      
      {/* 默认语言标记 */}
      <link rel="alternate" hrefLang="x-default" href={alternateUrls.en} />
      
      {/* Open Graph */}
      <meta property="og:title" content={`${toolName} - AI工具详情`} />
      <meta property="og:description" content={toolDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="SoniceAI" />
      <meta property="og:locale" content={lang} />
      <meta property="og:locale:alternate" content={Object.keys(alternateUrls).join(',')} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${toolName} - AI工具详情`} />
      <meta name="twitter:description" content={toolDescription} />
      <meta name="twitter:site" content="@soniceai" />
      
      {/* Robots */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* 防止重复内容 */}
      <meta name="googlebot" content="index, follow, noarchive" />
      <meta name="bingbot" content="index, follow, noarchive" />
      
      {/* 结构化数�?- 解决重复网页问题 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": toolName,
            "description": toolDescription,
            "url": canonicalUrl,
            "applicationCategory": tool.type,
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": tool.rating,
              "ratingCount": tool.users,
              "bestRating": 5,
              "worstRating": 1
            },
            "author": {
              "@type": "Organization",
              "name": "SoniceAI"
            },
            "publisher": {
              "@type": "Organization",
              "name": "SoniceAI",
              "url": "https://soniceai.com"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonicalUrl
            },
            "isPartOf": {
              "@type": "WebSite",
              "name": "SoniceAI",
              "url": "https://soniceai.com"
            }
          })
        }}
      />
      
      {/* 面包屑导航结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "首页",
                "item": "https://soniceai.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "AI工具",
                "item": "https://soniceai.com/tools"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": toolName,
                "item": canonicalUrl
              }
            ]
          })
        }}
      />
      
      {/* 防止重复索引的额外标�?*/}
      <meta name="google" content="notranslate" />
      <meta name="format-detection" content="telephone=no" />
    </Head>
  );
} 
