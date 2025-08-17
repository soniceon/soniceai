// 应用常量

// 应用信息
export const APP_CONFIG = {
  NAME: 'SoniceAI',
  DESCRIPTION: 'Discover the Best AI Tools and Websites',
  VERSION: '1.0.0',
  AUTHOR: 'SoniceAI Team',
  WEBSITE: 'https://soniceai.com',
} as const;

// API配置
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// 认证配置
export const AUTH_CONFIG = {
  TOKEN_EXPIRY: '7d',
  REFRESH_TOKEN_EXPIRY: '30d',
  COOKIE_NAME: 'token',
  REMEMBER_ME_EXPIRY: '30d',
} as const;

// 分页配置
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// 缓存配置
export const CACHE_CONFIG = {
  DEFAULT_TTL: 300000, // 5分钟
  MAX_SIZE: 1000,
  CLEANUP_INTERVAL: 60000, // 1分钟
} as const;

// 文件上传配置
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_FILES: 10,
} as const;

// 验证配置
export const VALIDATION_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  EMAIL_MAX_LENGTH: 254,
} as const;

// 主题配置
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// 语言配置
export const LANGUAGE_CONFIG = {
  DEFAULT: 'en',
  SUPPORTED: ['en', 'zh', 'ja', 'ko', 'de', 'fr', 'es', 'ru', 'pt'],
  NAMES: {
    en: 'English',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
    de: 'Deutsch',
    fr: 'Français',
    es: 'Español',
    ru: 'Русский',
    pt: 'Português',
  },
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully.',
  UPDATED: 'Resource updated successfully.',
  DELETED: 'Resource deleted successfully.',
  SAVED: 'Changes saved successfully.',
  UPLOADED: 'File uploaded successfully.',
} as const;

// 状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// 正则表达式
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,30}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  PHONE: /^\+?[\d\s-()]{10,}$/,
} as const;

// 本地存储键
export const STORAGE_KEYS = {
  THEME: 'theme',
  LANGUAGE: 'language',
  USER_PREFERENCES: 'user_preferences',
  CACHE_DATA: 'cache_data',
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

// 事件名称
export const EVENTS = {
  THEME_CHANGE: 'theme:change',
  LANGUAGE_CHANGE: 'language:change',
  AUTH_STATE_CHANGE: 'auth:state_change',
  USER_UPDATE: 'user:update',
  ERROR_OCCURRED: 'error:occurred',
} as const;

// 动画配置
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// 响应式断点
export const BREAKPOINTS = {
  XS: 0,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const; 
