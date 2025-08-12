module.exports = {
  // 部署环境配置
  environments: {
    development: {
      name: 'Development',
      url: 'http://localhost:3000',
      apiUrl: 'http://localhost:3000/api',
      env: 'development',
    },
    staging: {
      name: 'Staging',
      url: 'https://staging.soniceai.com',
      apiUrl: 'https://staging.soniceai.com/api',
      env: 'staging',
    },
    production: {
      name: 'Production',
      url: 'https://soniceai.com',
      apiUrl: 'https://soniceai.com/api',
      env: 'production',
    },
  },

  // 构建配置
  build: {
    outputDir: '.next',
    staticDir: 'public',
    optimizeImages: true,
    compress: true,
    minify: true,
  },

  // 部署配置
  deploy: {
    // 静态资源CDN配置
    cdn: {
      enabled: true,
      domain: 'cdn.soniceai.com',
      regions: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
    },

    // 缓存策略
    cache: {
      static: 'public, max-age=31536000, immutable',
      api: 'public, max-age=300, stale-while-revalidate=600',
      html: 'public, max-age=0, must-revalidate',
    },

    // 安全头配置
    security: {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self'; object-src 'none';",
      },
    },

    // 监控配置
    monitoring: {
      enabled: true,
      services: ['google-analytics', 'sentry'],
      performance: true,
      errors: true,
      userBehavior: true,
    },
  },

  // SEO配置
  seo: {
    sitemap: {
      enabled: true,
      autoGenerate: true,
      updateFrequency: 'daily',
      priority: {
        home: 1.0,
        tools: 0.9,
        categories: 0.8,
        toolDetail: 0.7,
      },
    },

    robots: {
      enabled: true,
      allowAll: true,
      disallow: ['/admin', '/api', '/auth'],
      sitemap: 'https://soniceai.com/sitemap.xml',
    },

    meta: {
      defaultTitle: 'SoniceAI - Discover the Best AI Tools and Websites',
      defaultDescription: 'Explore a comprehensive collection of AI tools, categorized and ranked, to help you find the perfect solution.',
      defaultKeywords: 'AI tools, artificial intelligence, chatbot, image generation, coding assistant',
      ogImage: '/og-image.jpg',
      twitterCard: 'summary_large_image',
    },
  },

  // 性能优化配置
  performance: {
    // 图片优化
    images: {
      formats: ['webp', 'avif'],
      sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      quality: 75,
      placeholder: 'blur',
    },

    // 代码分割
    codeSplitting: {
      enabled: true,
      chunks: {
        vendor: ['react', 'react-dom', 'next'],
        common: ['lodash', 'axios'],
        utils: ['date-fns', 'clsx'],
      },
    },

    // 预加载策略
    preload: {
      critical: ['/styles/globals.css', '/components/Navbar'],
      prefetch: ['/tools', '/categories'],
    },
  },

  // 国际化配置
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'fr', 'es', 'de', 'ru', 'ja', 'ko', 'pt'],
    localeDetection: true,
    domains: [
      {
        domain: 'soniceai.com',
        defaultLocale: 'en',
      },
      {
        domain: 'soniceai.cn',
        defaultLocale: 'zh',
      },
    ],
  },

  // 测试配置
  testing: {
    unit: {
      enabled: true,
      framework: 'jest',
      coverage: 80,
      watch: true,
    },
    integration: {
      enabled: true,
      framework: 'cypress',
      e2e: true,
    },
    performance: {
      enabled: true,
      lighthouse: true,
      webPageTest: true,
    },
  },

  // CI/CD配置
  ci: {
    provider: 'github',
    branches: ['main', 'develop'],
    autoDeploy: true,
    environments: ['staging', 'production'],
    notifications: {
      slack: true,
      email: true,
    },
  },
}; 