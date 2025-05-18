const axios = require('axios');
const crypto = require('crypto');

// Baidu Translation API configuration
const config = {
  appid: process.env.BAIDU_TRANSLATE_APP_ID,
  key: process.env.BAIDU_TRANSLATE_SECRET_KEY,
  salt: Date.now(),
  from: 'en',
  to: 'zh',
  endpoint: 'https://api.fanyi.baidu.com/api/trans/vip/translate'
};

// Generate sign for Baidu API
function generateSign(text) {
  const str = config.appid + text + config.salt + config.key;
  return crypto.createHash('md5').update(str).digest('hex');
}

// Translate text using Baidu API
async function translate(text, targetLang) {
  if (!text || !targetLang || targetLang === 'en') return text;
  
  try {
    const sign = generateSign(text);
    const params = {
      q: text,
      from: config.from,
      to: targetLang,
      appid: config.appid,
      salt: config.salt,
      sign: sign
    };

    const response = await axios.get(config.endpoint, { params });
    
    if (response.data && response.data.trans_result && response.data.trans_result[0]) {
      return response.data.trans_result[0].dst;
    }
    
    throw new Error('Translation failed: ' + JSON.stringify(response.data));
  } catch (error) {
    console.error(`[Baidu Translate Error] ${targetLang}: ${text}`, error.message);
    return text;
  }
}

module.exports = {
  translate
}; 