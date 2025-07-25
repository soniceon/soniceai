# SonicE AI Tools Platform

AI 工具导航与评测平台，支持多语言国际化。

## 维护约定

自 v1.0-stable 版本起，本项目遵循以下维护约定：

1. **仅允许修改的文件**：
   - `src/data/aiTools.ts` - AI 工具卡片数据
   - `src/data/aiTools.json` - AI 工具卡片数据（JSON 格式）

2. **禁止修改的内容**：
   - 网站布局与样式
   - 国际化配置与翻译
   - 核心功能与组件
   - 其他任何文件

3. **如需大改**：
   - 请创建新的分支
   - 或 Fork 项目进行开发

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- i18next

## 开发

```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 构建生产版本
npm run build

# 运行生产版本
npm start
```

## 国际化支持

- 中文 (zh)
- 英文 (en)
- 日文 (ja)
- 韩文 (ko)
- 德文 (de)
- 法文 (fr)
- 西班牙文 (es)
- 俄文 (ru) 