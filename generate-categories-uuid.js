const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const categories = require('./src/data/categories.json');

const newCategories = categories.map(cat => ({
  ...cat,
  type: cat.id,
  id: uuidv4()
}));

fs.writeFileSync('./src/data/categories.uuid.json', JSON.stringify(newCategories, null, 2), 'utf-8');
console.log('已生成带uuid的 categories.uuid.json');
