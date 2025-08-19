import { NextApiRequest, NextApiResponse } from 'next';
import { aiTools } from '@/data/aiTools';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const baseUrl = 'https://soniceai.com';
  const currentDate = new Date().toISOString();

  // 生成sitemap XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 首页 - 最高优先级
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // 主要页面 - 高优先级
  const mainPages = [
    { path: '/tools', priority: '0.9', changefreq: 'daily' },
    { path: '/categories', priority: '0.9', changefreq: 'daily' },
    { path: '/rankings', priority: '0.9', changefreq: 'daily' },
    { path: '/featured', priority: '0.9', changefreq: 'daily' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/privacy', priority: '0.6', changefreq: 'monthly' },
    { path: '/terms', priority: '0.6', changefreq: 'monthly' },
  ];

  mainPages.forEach(page => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // 分类页面 - 高优先级
  const categories = [
    'chatbot', 'image-generation', 'text-generation', 'video-generation',
    'audio-generation', 'code-generation', 'data-analysis', 'productivity',
    'education', 'business', 'creative', 'research'
  ];

  categories.forEach(category => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/categories/${category}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  // 工具详情页面 - 中高优先级
  aiTools.forEach(tool => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/tools/${tool.id}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  // 排行榜页面 - 中高优先级
  const rankingPages = [
    '/rankings/categories', '/rankings/region', '/rankings/revenue',
    '/rankings/popular', '/rankings/trending', '/rankings/newest'
  ];

  rankingPages.forEach(page => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${page}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  // 搜索和筛选页面 - 中优先级
  const searchPages = [
    '/tools?category=chatbot', '/tools?category=image-generation',
    '/tools?category=text-generation', '/tools?category=video-generation',
    '/tools?category=audio-generation', '/tools?category=code-generation',
    '/tools?category=data-analysis', '/tools?category=productivity',
    '/tools?category=education', '/tools?category=business',
    '/tools?category=creative', '/tools?category=research'
  ];

  searchPages.forEach(page => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${page}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  });

  // 语言特定页面 - 中优先级
  const languages = ['zh', 'en', 'ja', 'ko', 'de', 'fr', 'es', 'ru'];
  languages.forEach(lang => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/${lang}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += '</urlset>';

  // 设置响应头
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate'); // 减少缓存时间到1小时
  
  res.status(200).send(xml);
} 
