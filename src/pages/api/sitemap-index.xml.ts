import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const baseUrl = 'https://soniceai.com';
  const currentDate = new Date().toISOString();

  // 生成sitemap索引XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 主sitemap
  xml += `  <sitemap>\n`;
  xml += `    <loc>${baseUrl}/api/sitemap.xml</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += `  </sitemap>\n`;

  // 分类sitemap
  xml += `  <sitemap>\n`;
  xml += `    <loc>${baseUrl}/api/sitemap-categories.xml</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += `  </sitemap>\n`;

  // 工具sitemap
  xml += `  <sitemap>\n`;
  xml += `    <loc>${baseUrl}/api/sitemap-tools.xml</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += `  </sitemap>\n`;

  xml += '</sitemapindex>';

  // 设置响应头
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  
  res.status(200).send(xml);
} 