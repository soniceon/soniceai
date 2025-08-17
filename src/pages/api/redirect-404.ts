import { NextApiRequest, NextApiResponse } from 'next';

// 404重定向映射
const redirectMap: Record<string, string> = {
  // 旧路径重定向
  '/old-tools': '/tools',
  '/ai-tools': '/tools',
  '/tool': '/tools',
  '/category': '/categories',
  '/ranking': '/rankings',
  
  // 常见拼写错误
  '/toos': '/tools',
  '/categoris': '/categories',
  '/rankingss': '/rankings',
  
  // 大写路径
  '/Tools': '/tools',
  '/Categories': '/categories',
  '/Rankings': '/rankings',
  
  // 带.html的路径
  '/tools.html': '/tools',
  '/categories.html': '/categories',
  '/rankings.html': '/rankings',
  
  // 重复路径
  '/tools/tools': '/tools',
  '/categories/categories': '/categories',
  '/rankings/rankings': '/rankings',
  
  // 搜索相关
  '/search': '/tools',
  '/search.html': '/tools',
  
  // 旧版本路径
  '/v1': '/',
  '/v2': '/',
  '/beta': '/',
  '/alpha': '/',
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  
  if (!path || typeof path !== 'string') {
    return res.status(400).json({ error: 'Path parameter is required' });
  }

  // 查找重定向路径
  const redirectPath = redirectMap[path];
  
  if (redirectPath) {
    // 301永久重定向
    res.setHeader('Location', redirectPath);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1年缓存
    return res.status(301).json({ 
      redirect: true, 
      from: path, 
      to: redirectPath 
    });
  }

  // 如果没有找到重定向，返回404
  return res.status(404).json({ 
    error: 'Page not found',
    path: path,
    suggestions: [
      '/tools',
      '/categories', 
      '/rankings',
      '/featured'
    ]
  });
} 