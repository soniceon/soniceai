interface ErrorEvent {
  type: '404' | 'redirect' | 'duplicate' | 'canonical';
  path: string;
  timestamp: number;
  userAgent?: string;
  referrer?: string;
  targetPath?: string;
}

class ErrorTracker {
  private errors: ErrorEvent[] = [];
  private maxErrors = 1000; // 最大存储错误数量
  
  // 记录404错误
  track404(path: string, userAgent?: string, referrer?: string) {
    this.addError({
      type: '404',
      path,
      timestamp: Date.now(),
      userAgent,
      referrer
    });
  }
  
  // 记录重定向
  trackRedirect(fromPath: string, toPath: string, userAgent?: string) {
    this.addError({
      type: 'redirect',
      path: fromPath,
      timestamp: Date.now(),
      userAgent,
      targetPath: toPath
    });
  }
  
  // 记录重复页面
  trackDuplicate(path: string, canonicalPath: string, userAgent?: string) {
    this.addError({
      type: 'duplicate',
      path,
      timestamp: Date.now(),
      userAgent,
      targetPath: canonicalPath
    });
  }
  
  // 记录canonical问题
  trackCanonical(path: string, canonicalPath: string, userAgent?: string) {
    this.addError({
      type: 'canonical',
      path,
      timestamp: Date.now(),
      userAgent,
      targetPath: canonicalPath
    });
  }
  
  // 添加错误到列表
  private addError(error: ErrorEvent) {
    this.errors.push(error);
    
    // 如果错误数量超过限制，移除最旧的
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }
    
    // 在开发环境下输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log('Error tracked:', error);
    }
  }
  
  // 获取错误统计
  getErrorStats() {
    const stats = {
      total: this.errors.length,
      byType: {} as Record<string, number>,
      recent: this.errors.slice(-100), // 最近100个错误
      paths: {} as Record<string, number>
    };
    
    // 按类型统计
    this.errors.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.paths[error.path] = (stats.paths[error.path] || 0) + 1;
    });
    
    return stats;
  }
  
  // 获取特定路径的错误
  getErrorsByPath(path: string) {
    return this.errors.filter(error => error.path === path);
  }
  
  // 获取特定类型的错误
  getErrorsByType(type: ErrorEvent['type']) {
    return this.errors.filter(error => error.type === type);
  }
  
  // 清除错误记录
  clearErrors() {
    this.errors = [];
  }
  
  // 导出错误数据
  exportErrors() {
    return JSON.stringify(this.errors, null, 2);
  }
  
  // 检查是否有重复页面问题
  checkDuplicateIssues() {
    const duplicates = this.errors.filter(error => error.type === 'duplicate');
    const paths = duplicates.map(error => error.path);
    
    return {
      hasIssues: duplicates.length > 0,
      duplicatePaths: paths,
      count: duplicates.length
    };
  }
  
  // 检查404错误趋势
  check404Trends() {
    const errors404 = this.errors.filter(error => error.type === '404');
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    
    const recent24h = errors404.filter(error => error.timestamp > oneDayAgo);
    const recentWeek = errors404.filter(error => error.timestamp > oneWeekAgo);
    
    return {
      last24h: recent24h.length,
      lastWeek: recentWeek.length,
      total: errors404.length,
      trend: recent24h.length > (recentWeek.length / 7) ? 'increasing' : 'decreasing'
    };
  }
}

// 创建全局错误跟踪器实例
export const errorTracker = new ErrorTracker();

// 导出便捷函数
export const track404 = (path: string, userAgent?: string, referrer?: string) => 
  errorTracker.track404(path, userAgent, referrer);

export const trackRedirect = (fromPath: string, toPath: string, userAgent?: string) => 
  errorTracker.trackRedirect(fromPath, toPath, userAgent);

export const trackDuplicate = (path: string, canonicalPath: string, userAgent?: string) => 
  errorTracker.trackDuplicate(path, canonicalPath, userAgent);

export const trackCanonical = (path: string, canonicalPath: string, userAgent?: string) => 
  errorTracker.trackCanonical(path, canonicalPath, userAgent);

export default errorTracker; 