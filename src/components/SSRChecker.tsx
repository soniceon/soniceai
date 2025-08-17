import { useEffect, useState } from 'react';

interface SSRCheckerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function SSRChecker({ children, fallback }: SSRCheckerProps) {
  const [isSSR, setIsSSR] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 检查是否在客户端
    setIsSSR(false);
    
    // 延迟设置hydration状态，确保组件完全渲染
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 如果还在SSR阶段，显示fallback或null
  if (isSSR) {
    return fallback || null;
  }

  // 如果还没有完全hydration，显示fallback
  if (!isHydrated) {
    return fallback || null;
  }

  // 完全渲染后显示内容
  return <>{children}</>;
}

// 检查是否在服务器端
export const isServer = typeof window === 'undefined';

// 检查是否在客户端
export const isClient = typeof window !== 'undefined';

// 检查是否已hydration
export const useIsHydrated = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}; 