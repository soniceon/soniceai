/**
 * @type {import('next-i18next').UserConfig}
 */
const path = require('path');
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'fr', 'es', 'de', 'ru', 'ja', 'ko', 'pt'],
    localeDetection: false,
  },
  localePath: typeof window === 'undefined'
    ? path.resolve('./public/locales')
    : '/public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  fallbackLng: 'en',
};