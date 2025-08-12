import { NextApiRequest, NextApiResponse } from 'next';
import { aiTools } from '@/data/aiTools';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const baseUrl = 'https://soniceai.com';
  const currentDate = new Date().toISOString();

  // 基础页面
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/tools', priority: '0.9', changefreq: 'daily' },
    { url: '/categories', priority: '0.8', changefreq: 'weekly' },
    { url: '/rankings', priority: '0.8', changefreq: 'weekly' },
    { url: '/featured', priority: '0.8', changefreq: 'weekly' },
  ];

  // 生成AI工具页面
  const toolPages = aiTools.map(tool => ({
    url: `/tools/${tool.id}`,
    priority: '0.7',
    changefreq: 'weekly'
  }));

  // 生成分类页面
  const categoryPages = aiTools.reduce((categories: string[], tool) => {
    if (tool.type && !categories.includes(tool.type)) {
      categories.push(tool.type);
    }
    return categories;
  }, []).map(type => ({
    url: `/categories/${type.toLowerCase().replace(/\s+/g, '-')}`,
    priority: '0.6',
    changefreq: 'weekly'
  }));

  // 合并所有页面
  const allPages = [...staticPages, ...toolPages, ...categoryPages];

  // 生成XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(sitemap);
} 