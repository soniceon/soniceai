import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 基础SEO标签 */}
        <title>SoniceAI - 发现最佳 AI 工具和网站</title>
        <meta name="description" content="探索全面的 AI 工具集合，分类和排名，帮助您找到完美的解决方案。从聊天机器人到图像生成，从编程助手到生产力工具，发现最适合您需求的AI工具。" />
        <meta name="keywords" content="AI 工具, 人工智能, 聊天机器人, 图像生成, 编程助手, 生产力工具, 机器学习, 自然语言处理" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://soniceai.com/" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Open Graph */}
        <meta property="og:title" content="SoniceAI - 发现最佳 AI 工具和网站" />
        <meta property="og:description" content="探索全面的 AI 工具集合，分类和排名，帮助您找到完美的解决方案。从聊天机器人到图像生成，从编程助手到生产力工具，发现最适合您需求的AI工具。" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://soniceai.com/" />
        <meta property="og:image" content="https://soniceai.com/og-image.jpg" />
        <meta property="og:site_name" content="SoniceAI" />
        <meta property="og:locale" content="en" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SoniceAI - 发现最佳 AI 工具和网站" />
        <meta name="twitter:description" content="探索全面的 AI 工具集合，分类和排名，帮助您找到完美的解决方案。从聊天机器人到图像生成，从编程助手到生产力工具，发现最适合您需求的AI工具。" />
        <meta name="twitter:image" content="https://soniceai.com/og-image.jpg" />
        <meta name="twitter:site" content="@soniceai" />
        
        {/* Robots */}
        <meta name="robots" content="index,follow" />
        
        {/* Language */}
        <meta httpEquiv="content-language" content="en" />
        
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Additional SEO */}
        <meta name="author" content="SoniceAI" />
        <meta name="theme-color" content="#6366f1" />
        
        {/* AI-Friendly Meta Tags */}
        <meta name="generator" content="Next.js" />
        <meta name="application-name" content="SoniceAI" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SoniceAI",
              "url": "https://soniceai.com",
              "description": "Discover and explore the best AI tools for various tasks",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://soniceai.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* Additional Structured Data for AI Tools */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "AI Tools Directory",
              "description": "A comprehensive directory of AI tools and applications",
              "url": "https://soniceai.com/tools",
              "numberOfItems": 100,
              "itemListElement": [
                {
                  "@type": "SoftwareApplication",
                  "name": "ChatGPT",
                  "description": "AI-powered chatbot for conversation and assistance",
                  "applicationCategory": "Chatbot",
                  "operatingSystem": "Web"
                },
                {
                  "@type": "SoftwareApplication", 
                  "name": "Midjourney",
                  "description": "AI image generation tool",
                  "applicationCategory": "Image Generation",
                  "operatingSystem": "Web"
                }
              ]
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 