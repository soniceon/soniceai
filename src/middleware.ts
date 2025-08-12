import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 处理重复的路径问题
  if (pathname.includes('/pages/pages/')) {
    const newPath = pathname.replace('/pages/pages/', '/');
    return NextResponse.redirect(new URL(newPath, request.url));
  }
  
  // 处理sites路径重定向
  if (pathname.includes('/sites/')) {
    const newPath = pathname.replace('/sites/', '/');
    return NextResponse.redirect(new URL(newPath, request.url));
  }
  
  // 处理重复的tools路径
  if (pathname.includes('/tools/tools/')) {
    const newPath = pathname.replace('/tools/tools/', '/tools/');
    return NextResponse.redirect(new URL(newPath, request.url));
  }
  
  // 处理search查询参数问题
  if (pathname.includes('/search?q=')) {
    return NextResponse.redirect(new URL('/tools', request.url));
  }
  
  // 处理.html扩展名
  if (pathname.endsWith('.html')) {
    const newPath = pathname.replace('.html', '');
    return NextResponse.redirect(new URL(newPath, request.url));
  }
  
  // 处理www和非www的规范化
  if (request.headers.get('host')?.startsWith('www.')) {
    const newUrl = new URL(request.url);
    newUrl.host = newUrl.host.replace('www.', '');
    return NextResponse.redirect(newUrl);
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