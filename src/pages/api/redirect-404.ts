import { NextApiRequest, NextApiResponse } from 'next';

// 定义重定向规则
const redirectRules = [
  // 工具相关重定向
  { from: /^\/tool\/(.+)$/, to: '/tools/$1' },
  { from: /^\/ai-tool\/(.+)$/, to: '/tools/$1' },
  { from: /^\/ai-tools\/(.+)$/, to: '/tools/$1' },
  { from: /^\/old-tools\/(.+)$/, to: '/tools/$1' },
  
  // 分类相关重定向
  { from: /^\/category\/(.+)$/, to: '/categories/$1' },
  { from: /^\/ai-category\/(.+)$/, to: '/categories/$1' },
  { from: /^\/type\/(.+)$/, to: '/categories/$1' },
  
  // 排行榜相关重定向
  { from: /^\/ranking\/(.+)$/, to: '/rankings/$1' },
  { from: /^\/top\/(.+)$/, to: '/rankings/$1' },
  { from: /^\/best\/(.+)$/, to: '/rankings/$1' },
  
  // 功能页面重定向
  { from: /^\/feature\/(.+)$/, to: '/featured/$1' },
  { from: /^\/popular\/(.+)$/, to: '/featured/$1' },
  
  // 搜索相关重定向
  { from: /^\/search\?q=(.+)$/, to: '/tools?search=$1' },
  { from: /^\/search\?query=(.+)$/, to: '/tools?search=$1' },
  { from: /^\/find\?q=(.+)$/, to: '/tools?search=$1' },
  
  // 语言相关重定向
  { from: /^\/cn\/(.+)$/, to: '/zh/$1' },
  { from: /^\/chinese\/(.+)$/, to: '/zh/$1' },
  { from: /^\/japanese\/(.+)$/, to: '/ja/$1' },
  { from: /^\/korean\/(.+)$/, to: '/ko/$1' },
  { from: /^\/german\/(.+)$/, to: '/de/$1' },
  { from: /^\/french\/(.+)$/, to: '/fr/$1' },
  { from: /^\/spanish\/(.+)$/, to: '/es/$1' },
  { from: /^\/russian\/(.+)$/, to: '/ru/$1' },
  
  // 常见拼写错误
  { from: /^\/toos\/(.+)$/, to: '/tools/$1' },
  { from: /^\/categoris\/(.+)$/, to: '/categories/$1' },
  { from: /^\/rankingss\/(.+)$/, to: '/rankings/$1' },
  
  // 下划线转连字符
  { from: /^\/tools\/([^\/]+)_([^\/]+)$/, to: '/tools/$1-$2' },
  { from: /^\/categories\/([^\/]+)_([^\/]+)$/, to: '/categories/$1-$2' },
  
  // 双斜杠处理
  { from: /^\/\/(.+)$/, to: '/$1' },
  
  // 尾部斜杠处理
  { from: /^(.+)\/$/, to: '$1' },
];

// 智能路径建议
const pathSuggestions = {
  'tool': '/tools',
  'category': '/categories', 
  'ranking': '/rankings',
  'feature': '/featured',
  'search': '/tools',
  'find': '/tools',
  'ai': '/tools',
  'chatbot': '/categories/chatbot',
  'image': '/categories/image-generation',
  'text': '/categories/text-generation',
  'video': '/categories/video-generation',
  'audio': '/categories/audio-generation',
  'code': '/categories/code-generation',
  'data': '/categories/data-analysis',
  'productivity': '/categories/productivity',
  'education': '/categories/education',
  'business': '/categories/business',
  'creative': '/categories/creative',
  'research': '/categories/research'
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { path, suggest } = req.query;
  
  if (suggest && typeof suggest === 'string') {
    // 提供路径建议
    const suggestions = [];
    const lowerSuggest = suggest.toLowerCase();
    
    for (const [key, value] of Object.entries(pathSuggestions)) {
      if (lowerSuggest.includes(key)) {
        suggestions.push(value);
      }
    }
    
    // 如果没有找到匹配的建议，提供通用建议
    if (suggestions.length === 0) {
      suggestions.push('/tools', '/categories', '/rankings', '/featured');
    }
    
    return res.status(200).json({
      originalPath: suggest,
      suggestions: Array.from(new Set(suggestions)), // 去重
      message: 'Path suggestions for 404 resolution'
    });
  }
  
  if (path && typeof path === 'string') {
    // 检查重定向规则
    for (const rule of redirectRules) {
      const match = path.match(rule.from);
      if (match) {
        const redirectTo = rule.to.replace(/\$(\d+)/g, (_, index) => match[index]);
        return res.status(200).json({
          originalPath: path,
          redirectTo,
          status: 'redirect',
          message: 'Path should be redirected'
        });
      }
    }
    
    // 如果没有匹配的重定向规则，提供建议
    const suggestions = [];
    const lowerPath = path.toLowerCase();
    
    for (const [key, value] of Object.entries(pathSuggestions)) {
      if (lowerPath.includes(key)) {
        suggestions.push(value);
      }
    }
    
    if (suggestions.length === 0) {
      suggestions.push('/tools', '/categories', '/rankings', '/featured');
    }
    
    return res.status(200).json({
      originalPath: path,
      suggestions: Array.from(new Set(suggestions)),
      status: 'no_redirect',
      message: 'No redirect rule found, but here are suggestions'
    });
  }
  
  // 默认返回所有重定向规则
  return res.status(200).json({
    redirectRules: redirectRules.map(rule => ({
      from: rule.from.toString(),
      to: rule.to
    })),
    pathSuggestions,
    message: 'Available redirect rules and path suggestions'
  });
} 