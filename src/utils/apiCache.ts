import { globalCache, localStorageCache } from './cache';

interface CacheOptions {
  ttl?: number;
  useLocalStorage?: boolean;
  key?: string;
}

export class ApiCache {
  private static instance: ApiCache;
  private cache: typeof globalCache;
  private localStorageCache: typeof localStorageCache;

  private constructor() {
    this.cache = globalCache;
    this.localStorageCache = localStorageCache;
  }

  public static getInstance(): ApiCache {
    if (!ApiCache.instance) {
      ApiCache.instance = new ApiCache();
    }
    return ApiCache.instance;
  }

  /**
   * 带缓存的API请求
   */
  async request<T>(
    url: string,
    options: RequestInit = {},
    cacheOptions: CacheOptions = {}
  ): Promise<T> {
    const {
      ttl = 300000, // 默认5分钟
      useLocalStorage = false,
      key = url,
    } = cacheOptions;

    const cacheKey = `api_${key}`;
    const targetCache = useLocalStorage ? this.localStorageCache : this.cache;

    // 尝试从缓存获取
    const cached = (targetCache as any).get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // 缓存结果
      targetCache.set(cacheKey, data, ttl);
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * 带缓存的GET请求
   */
  async get<T>(
    url: string,
    cacheOptions: CacheOptions = {}
  ): Promise<T> {
    return this.request<T>(url, { method: 'GET' }, cacheOptions);
  }

  /**
   * 带缓存的POST请求
   */
  async post<T>(
    url: string,
    data: any,
    cacheOptions: CacheOptions = {}
  ): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }, cacheOptions);
  }

  /**
   * 清除特定API的缓存
   */
  clearCache(key: string, useLocalStorage: boolean = false): boolean {
    const targetCache = useLocalStorage ? this.localStorageCache : this.cache;
    return (targetCache as any).delete(key);
  }

  /**
   * 清除所有缓存
   */
  clearAllCache(useLocalStorage: boolean = false): void {
    if (useLocalStorage) {
      (this.localStorageCache as any).clear();
    } else {
      (this.cache as any).clear();
    }
  }

  /**
   * 预加载API数据到缓存
   */
  async preload<T>(
    url: string,
    cacheOptions: CacheOptions = {}
  ): Promise<void> {
    try {
      await this.get<T>(url, cacheOptions);
    } catch (error) {
      console.warn('Preload failed:', error);
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): { size: number; hitRate: number } {
    const targetCache = this.cache;
    return (targetCache as any).getStats();
  }
}

// 导出单例实例
export const apiCache = ApiCache.getInstance();

// 便捷函数
export const cachedGet = <T>(url: string, options?: CacheOptions) => 
  apiCache.get<T>(url, options);

export const cachedPost = <T>(url: string, data: any, options?: CacheOptions) => 
  apiCache.post<T>(url, data, options);

export const clearApiCache = (key: string, useLocalStorage?: boolean) => 
  apiCache.clearCache(key, useLocalStorage);

export const clearAllApiCache = (useLocalStorage?: boolean) => 
  apiCache.clearAllCache(useLocalStorage); 
