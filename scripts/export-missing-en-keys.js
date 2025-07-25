const fs = require('fs');
const path = require('path');
const glob = require('glob');

const enFile = path.join(__dirname, '../public/locales/en/common.json');
const enJson = fs.existsSync(enFile) ? JSON.parse(fs.readFileSync(enFile, 'utf8')) : {};

const files = [
  ...glob.sync(path.join(__dirname, '../src/pages/**/*.{js,jsx,ts,tsx}')),
  ...glob.sync(path.join(__dirname, '../src/components/**/*.{js,jsx,ts,tsx}'))
];
const keySet = new Set();
const regexps = [
  /t\(['"`]([a-zA-Z0-9_\-.]+)['"`]\)/g, // t('key')
  /<Trans[^>]+i18nKey=["']([a-zA-Z0-9_\-.]+)["']/g // <Trans i18nKey="key"/>
];
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  regexps.forEach(re => {
    let match;
    while ((match = re.exec(content)) !== null) {
      if (match[1] && /^[a-zA-Z0-9_\-.]+$/.test(match[1])) {
        keySet.add(match[1]);
      }
    }
  });
});
const missing = Array.from(keySet).filter(key => !(key in enJson));
console.log('Missing keys in en/common.json:', missing);
fs.writeFileSync(path.join(__dirname, 'missing-en-keys.json'), JSON.stringify(missing, null, 2), 'utf8');
console.log('Exported to missing-en-keys.json'); 