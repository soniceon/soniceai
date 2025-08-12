import Head from 'next/head';
import { useRouter } from 'next/router';

interface CanonicalUrlProps {
  path?: string;
}

export default function CanonicalUrl({ path }: CanonicalUrlProps) {
  const router = useRouter();
  const canonicalPath = path || router.asPath;
  
  // 移除查询参数和哈希
  const cleanPath = canonicalPath.split('?')[0].split('#')[0];
  
  // 确保路径以/开头
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  
  const canonicalUrl = `https://soniceai.com${normalizedPath}`;
  
  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
} 