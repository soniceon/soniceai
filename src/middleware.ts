import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 处理重复的路径问题
  if (pathname.includes('/pages/pages/')) {
    const newPath = pathname.replace('/pages/pages/', '/');
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }
  
  // 处理sites路径重定向
  if (pathname.includes('/sites/')) {
    const newPath = pathname.replace('/sites/', '/');
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }
  
  // 处理重复的tools路径
  if (pathname.includes('/tools/tools/')) {
    const newPath = pathname.replace('/tools/tools/', '/tools/');
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }
  
  // 处理重复的categories路径
  if (pathname.includes('/categories/categories/')) {
    const newPath = pathname.replace('/categories/categories/', '/categories/');
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }
  
  // 处理重复的rankings路径
  if (pathname.includes('/rankings/rankings/')) {
    const newPath = pathname.replace('/rankings/rankings/', '/rankings/');
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }
  
  // 处理search查询参数问题
  if (pathname.includes('/search?q=') || pathname.includes('/search?query=')) {
    return NextResponse.redirect(new URL('/tools', request.url), 301);
  }
  
  // 处理.html扩展名 - 301永久重定向
  if (pathname.endsWith('.html')) {
    const newPath = pathname.replace('.html', '');
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }
  
  // 处理大写路径重定向
  if (pathname === '/Tools') {
    return NextResponse.redirect(new URL('/tools', request.url), 301);
  }
  if (pathname === '/Categories') {
    return NextResponse.redirect(new URL('/categories', request.url), 301);
  }
  if (pathname === '/Rankings') {
    return NextResponse.redirect(new URL('/rankings', request.url), 301);
  }
  
  // 处理旧版本路径
  if (pathname.startsWith('/old-tools/')) {
    const newPath = pathname.replace('/old-tools/', '/tools/');
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }
  if (pathname.startsWith('/ai-tools/')) {
    const newPath = pathname.replace('/ai-tools/', '/tools/');
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }
  
  // 处理常见拼写错误
  if (pathname === '/toos') {
    return NextResponse.redirect(new URL('/tools', request.url), 301);
  }
  if (pathname === '/categoris') {
    return NextResponse.redirect(new URL('/categories', request.url), 301);
  }
  if (pathname === '/rankingss') {
    return NextResponse.redirect(new URL('/rankings', request.url), 301);
  }
  
  // 处理搜索页面重定向
  if (pathname === '/search') {
    return NextResponse.redirect(new URL('/tools', request.url), 301);
  }
  
  // 处理旧版本标识
  if (pathname === '/v1' || pathname === '/v2' || pathname === '/beta' || pathname === '/alpha') {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }
  
  // 处理www和非www的规范化
  if (request.headers.get('host')?.startsWith('www.')) {
    const newUrl = new URL(request.url);
    newUrl.host = newUrl.host.replace('www.', '');
    return NextResponse.redirect(newUrl, 301);
  }
  
  // 处理查询参数规范化
  const url = new URL(request.url);
  if (url.searchParams.has('q') && !url.searchParams.has('search')) {
    const query = url.searchParams.get('q');
    url.searchParams.delete('q');
    url.searchParams.set('search', query || '');
    return NextResponse.redirect(url, 301);
  }
  
  // 新增：处理更多的404和重定向问题
  
  // 处理常见的404路径
  const common404Paths = [
    '/tool', '/category', '/ranking', '/feature', '/ai-tool', '/ai-category',
    '/chatbot-tools', '/image-tools', '/text-tools', '/video-tools', '/audio-tools',
    '/code-tools', '/data-tools', '/productivity-tools', '/education-tools',
    '/business-tools', '/creative-tools', '/research-tools'
  ];
  
  for (const path of common404Paths) {
    if (pathname === path) {
      if (path.includes('tool')) {
        return NextResponse.redirect(new URL('/tools', request.url), 301);
      } else if (path.includes('category')) {
        return NextResponse.redirect(new URL('/categories', request.url), 301);
      } else if (path.includes('ranking')) {
        return NextResponse.redirect(new URL('/rankings', request.url), 301);
      } else if (path.includes('feature')) {
        return NextResponse.redirect(new URL('/featured', request.url), 301);
      }
    }
  }
  
  // 处理带下划线的路径
  if (pathname.includes('_')) {
    const newPath = pathname.replace(/_/g, '-');
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }
  
  // 处理双斜杠问题
  if (pathname.includes('//')) {
    const newPath = pathname.replace(/\/+/g, '/');
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }
  
  // 处理尾部斜杠问题（除了根路径）
  if (pathname !== '/' && pathname.endsWith('/')) {
    const newPath = pathname.slice(0, -1);
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }
  
  // 处理查询参数中的重复参数
  const searchParams = url.searchParams;
  const seenParams = new Set<string>();
  const cleanParams = new URLSearchParams();
  
  // 使用Array.from来避免迭代器问题
  Array.from(searchParams.entries()).forEach(([key, value]) => {
    if (!seenParams.has(key)) {
      cleanParams.set(key, value);
      seenParams.add(key);
    }
  });
  
  if (searchParams.toString() !== cleanParams.toString()) {
    url.search = cleanParams.toString();
    return NextResponse.redirect(url, 301);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 