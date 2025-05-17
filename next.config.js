const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.apple.com'],
  },
  i18n,
  webpack: (config, { isServer }) => {
    // Exclude src_backup_i18n_temp directory from compilation
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/src_backup_i18n_temp/**']
    };
    
    return config;
  }
}

module.exports = nextConfig 