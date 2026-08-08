# 🧵 PatchPalette

手工爱好者的数字工作室：收集灵感、管理布料、裁布前先预览拼布效果。

## 技术栈

- React + TypeScript + Vite
- Tailwind CSS
- Dexie.js (IndexedDB)
- PWA (离线可用 / 添加到主屏幕)

## 开发

```bash
npm install
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览构建产物
```

## 项目结构

```
src/
├── components/    # 通用组件
├── pages/         # 三个主页面（灵感库 / 布料库 / 拼布）
├── db/            # Dexie.js 数据库模型
├── hooks/         # 自定义 Hooks
├── utils/         # 工具函数
├── App.tsx        # 主入口 + Tab 导航
└── main.tsx       # 渲染入口
```
