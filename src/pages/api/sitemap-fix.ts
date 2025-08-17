import { NextApiRequest, NextApiResponse } from 'next';
import { aiTools } from '@/data/aiTools';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 设置正确的Content-Type
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');

  // 生成XML sitemap
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- 首页 -->
  <url>
    <loc>https://soniceai.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://soniceai.com/en"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://soniceai.com/zh"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://soniceai.com/ja"/>
    <xhtml:link rel="alternate" hreflang="ko" href="https://soniceai.com/ko"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://soniceai.com/de"/>
    <xhtml:link rel="alternate" hreflang="fr" href="https://soniceai.com/fr"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://soniceai.com/es"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://soniceai.com/ru"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://soniceai.com/"/>
  </url>

  <!-- 工具列表�?-->
  <url>
    <loc>https://soniceai.com/tools</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://soniceai.com/en/tools"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://soniceai.com/zh/tools"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://soniceai.com/ja/tools"/>
    <xhtml:link rel="alternate" hreflang="ko" href="https://soniceai.com/ko/tools"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://soniceai.com/de/tools"/>
    <xhtml:link rel="alternate" hreflang="fr" href="https://soniceai.com/fr/tools"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://soniceai.com/es/tools"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://soniceai.com/ru/tools"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://soniceai.com/tools"/>
  </url>

  <!-- 分类页面 -->
  <url>
    <loc>https://soniceai.com/categories</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://soniceai.com/en/categories"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://soniceai.com/zh/categories"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://soniceai.com/ja/categories"/>
    <xhtml:link rel="alternate" hreflang="ko" href="https://soniceai.com/ko/categories"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://soniceai.com/de/categories"/>
    <xhtml:link rel="alternate" hreflang="fr" href="https://soniceai.com/fr/categories"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://soniceai.com/es/categories"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://soniceai.com/ru/categories"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://soniceai.com/categories"/>
  </url>

  <!-- 排行榜页�?-->
  <url>
    <loc>https://soniceai.com/rankings</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://soniceai.com/en/rankings"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://soniceai.com/zh/rankings"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://soniceai.com/ja/rankings"/>
    <xhtml:link rel="alternate" hreflang="ko" href="https://soniceai.com/ko/rankings"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://soniceai.com/de/rankings"/>
    <xhtml:link rel="alternate" hreflang="fr" href="https://soniceai.com/fr/rankings"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://soniceai.com/es/rankings"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://soniceai.com/ru/rankings"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://soniceai.com/rankings"/>
  </url>

  <!-- 精选页�?-->
  <url>
    <loc>https://soniceai.com/featured</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://soniceai.com/en/featured"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://soniceai.com/zh/featured"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://soniceai.com/ja/featured"/>
    <xhtml:link rel="alternate" hreflang="ko" href="https://soniceai.com/ko/featured"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://soniceai.com/de/featured"/>
    <xhtml:link rel="alternate" hreflang="fr" href="https://soniceai.com/fr/featured"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://soniceai.com/es/featured"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://soniceai.com/ru/featured"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://soniceai.com/featured"/>
  </url>

  <!-- 工具详情页面 -->
  ${aiTools.map(tool => `
  <url>
    <loc>https://soniceai.com/tools/${tool.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://soniceai.com/en/tools/${tool.id}"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://soniceai.com/zh/tools/${tool.id}"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://soniceai.com/ja/tools/${tool.id}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="https://soniceai.com/ko/tools/${tool.id}"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://soniceai.com/de/tools/${tool.id}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="https://soniceai.com/fr/tools/${tool.id}"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://soniceai.com/es/tools/${tool.id}"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://soniceai.com/ru/tools/${tool.id}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://soniceai.com/tools/${tool.id}"/>
  </url>`).join('')}

  <!-- 分类详情页面 -->
  ${Array.from(new Set(aiTools.map(tool => tool.type))).map(type => `
  <url>
    <loc>https://soniceai.com/categories/${type.toLowerCase().replace(/\s+/g, '-')}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://soniceai.com/en/categories/${type.toLowerCase().replace(/\s+/g, '-')}"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://soniceai.com/zh/categories/${type.toLowerCase().replace(/\s+/g, '-')}"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://soniceai.com/ja/categories/${type.toLowerCase().replace(/\s+/g, '-')}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="https://soniceai.com/ko/categories/${type.toLowerCase().replace(/\s+/g, '-')}"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://soniceai.com/de/categories/${type.toLowerCase().replace(/\s+/g, '-')}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="https://soniceai.com/fr/categories/${type.toLowerCase().replace(/\s+/g, '-')}"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://soniceai.com/es/categories/${type.toLowerCase().replace(/\s+/g, '-')}"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://soniceai.com/ru/categories/${type.toLowerCase().replace(/\s+/g, '-')}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://soniceai.com/categories/${type.toLowerCase().replace(/\s+/g, '-')}"/>
  </url>`).join('')}

</urlset>`;

  res.status(200).send(xml);
} 
