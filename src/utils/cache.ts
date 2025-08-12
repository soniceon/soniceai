interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private storage: Map<string, CacheItem<any>>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.storage = new Map();
    this.maxSize = maxSize;
  }

  set<T>(key: string, value: T, ttl: number = 60000): void {
    // 如果缓存已满，删除最旧的项
    if (this.storage.size >= this.maxSize) {
      const oldestKey = this.storage.keys().next().value;
      if (oldestKey) {
        this.storage.delete(oldestKey);
      }
    }

    this.storage.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const item = this.storage.get(key);
    
    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.storage.delete(key);
      return null;
    }

    return item.value;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  size(): number {
    return this.storage.size;
  }

  // 清理过期的缓存项
  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.storage.entries());
    entries.forEach(([key, item]) => {
      if (now - item.timestamp > item.ttl) {
        this.storage.delete(key);
      }
    });
  }

  // 获取缓存统计信息
  getStats() {
    return {
      size: this.storage.size,
      maxSize: this.maxSize,
      keys: Array.from(this.storage.keys()),
    };
  }
}

// 创建全局缓存实例
export const globalCache = new Cache(200);

// 本地存储缓存
export class LocalStorageCache {
  private prefix: string;

  constructor(prefix: string = 'sonice_cache_') {
    this.prefix = prefix;
  }

  set<T>(key: string, value: T, ttl: number = 60000): void {
    try {
      const item: CacheItem<T> = {
        value,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set cache item:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(this.prefix + key);
      if (!itemStr) return null;

      const item: CacheItem<T> = JSON.parse(itemStr);
      
      // 检查是否过期
      if (Date.now() - item.timestamp > item.ttl) {
        this.delete(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.warn('Failed to get cache item:', error);
      return null;
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.warn('Failed to delete cache item:', error);
      return false;
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  cleanup(): void {
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const itemStr = localStorage.getItem(key);
          if (itemStr) {
            try {
              const item: CacheItem<any> = JSON.parse(itemStr);
              if (now - item.timestamp > item.ttl) {
                localStorage.removeItem(key);
              }
            } catch (error) {
              // 如果解析失败，删除该项
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.warn('Failed to cleanup cache:', error);
    }
  }

  // 获取缓存统计信息
  getStats() {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(this.prefix));
      return {
        size: cacheKeys.length,
        maxSize: Infinity, // 本地存储没有最大限制
        keys: cacheKeys.map(key => key.replace(this.prefix, '')),
      };
    } catch (error) {
      console.warn('Failed to get cache stats:', error);
      return {
        size: 0,
        maxSize: Infinity,
        keys: [],
      };
    }
  }
}

// 创建本地存储缓存实例
export const localStorageCache = new LocalStorageCache();

// 定期清理过期缓存
if (typeof window !== 'undefined') {
  setInterval(() => {
    globalCache.cleanup();
    localStorageCache.cleanup();
  }, 60000); // 每分钟清理一次
} 