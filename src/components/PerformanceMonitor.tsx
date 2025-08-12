import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  useEffect(() => {
    // 只在生产环境中监控性能
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        setMetrics((prev) => ({ ...prev, fcp: fcpEntry.startTime }));
      }
    });

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lcpEntry = entries[entries.length - 1];
      if (lcpEntry) {
        setMetrics((prev) => ({ ...prev, lcp: lcpEntry.startTime }));
      }
    });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'first-input') {
          const firstInputEntry = entry as PerformanceEventTiming;
          setMetrics((prev) => ({ ...prev, fid: firstInputEntry.processingStart - firstInputEntry.startTime }));
        }
      });
    });

    // Cumulative Layout Shift (CLS)
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      setMetrics((prev) => ({ ...prev, cls: clsValue }));
    });

    // Time to First Byte (TTFB)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      setMetrics((prev) => ({ ...prev, ttfb: navigationEntry.responseStart - navigationEntry.requestStart }));
    }

    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance monitoring not supported:', error);
    }

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  // 发送性能数据到分析服务
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && metrics.fcp !== null) {
      // 这里可以发送到 Google Analytics 或其他分析服务
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'performance_metrics', {
          event_category: 'performance',
          fcp: Math.round(metrics.fcp),
          lcp: metrics.lcp ? Math.round(metrics.lcp) : null,
          fid: metrics.fid ? Math.round(metrics.fid) : null,
          cls: metrics.cls ? Math.round(metrics.cls * 1000) / 1000 : null,
          ttfb: metrics.ttfb ? Math.round(metrics.ttfb) : null,
        });
      }
    }
  }, [metrics]);

  // 只在开发环境中显示性能指标
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <div className="mb-2 font-bold">Performance Metrics</div>
      <div>FCP: {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'N/A'}</div>
      <div>LCP: {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A'}</div>
      <div>FID: {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'N/A'}</div>
      <div>CLS: {metrics.cls ? Math.round(metrics.cls * 1000) / 1000 : 'N/A'}</div>
      <div>TTFB: {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'N/A'}</div>
    </div>
  );
} 