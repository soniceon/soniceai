/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ja', 'ko', 'de', 'fr', 'es', 'ru'],
  },
  defaultNS: 'common',
  localePath: './public/locales',
  ns: ['common', 'auth', 'profile', 'tools'],
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}