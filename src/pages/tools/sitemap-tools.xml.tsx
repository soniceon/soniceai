import { GetServerSideProps } from 'next';
import { aiTools } from '@/data/aiTools';

const EXTERNAL_DATA_URL = 'https://soniceai.com';

function generateToolsSiteMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${aiTools.map((tool) => `
  <url>
    <loc>${EXTERNAL_DATA_URL}/tools/${tool.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`).join('')}
</urlset>`;
}

function ToolsSiteMap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateToolsSiteMap();

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default ToolsSiteMap; 
