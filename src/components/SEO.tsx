import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = 'SoniceAI - Discover the Best AI Tools and Websites',
  description = 'Explore AI tools for chatbots, image generation, coding, and productivity. Find the perfect AI solution for your needs.',
  keywords = 'AI tools, artificial intelligence, chatbot, image generation, coding, productivity',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
}) => {
  const router = useRouter();
  const canonicalUrl = `https://soniceai.com${router.asPath}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="SoniceAI" />
      <meta property="og:locale" content={router.locale || 'en'} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@soniceai" />
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      
      {/* Language */}
      <meta httpEquiv="content-language" content={router.locale || 'en'} />
      
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
      
      {/* Structured Data for AI Crawlers */}
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
  );
};

export default SEO; 
