import { GetServerSideProps } from 'next';
import { aiTools } from '@/data/aiTools';

const EXTERNAL_DATA_URL = 'https://soniceai.com';

function generateCategoriesSiteMap() {
  // 获取所有唯一的工具类�?
  const toolTypes = Array.from(new Set(aiTools.map(tool => tool.type)));
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${EXTERNAL_DATA_URL}/categories</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
${toolTypes.map((type) => `
  <url>
    <loc>${EXTERNAL_DATA_URL}/categories/${type.toLowerCase().replace(/\s+/g, '-')}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`).join('')}
</urlset>`;
}

function CategoriesSiteMap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateCategoriesSiteMap();

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default CategoriesSiteMap; 
