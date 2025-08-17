export const config = {
  // App配置
  app: {
    name: 'SoniceAI',
    description: 'Discover the Best AI Tools and Websites',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    version: '1.0.0',
  },
  
  // API配置
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 10000,
  },
  
  // 认证配置
  auth: {
    tokenExpiry: '7d',
    refreshTokenExpiry: '30d',
    cookieName: 'token',
  },
  
  // 邮件配置
  email: {
    from: process.env.EMAIL_FROM || 'noreply@soniceai.com',
    service: process.env.EMAIL_SERVICE || 'gmail',
  },
  
  // 数据库配�?
  database: {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // 分析配置
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  },
  
  // 功能开�?
  features: {
    enableOAuth: true,
    enableEmailVerification: true,
    enablePasswordReset: true,
    enableUserProfiles: true,
  },
} as const;

export type Config = typeof config; 
