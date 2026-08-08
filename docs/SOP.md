# PatchPalette — 开发交接文档 (SOP)

> 每完成一步开发，在此记录：日期时间、本步目标、实际做了什么、下一步是什么。

---

## 会话记录

### 2026-08-09 — 会话 #1：需求沟通与项目初始化

**时间段**：上午 ~ 下午

**做了什么**：
1. 完整需求沟通：灵感库分类管理、教程收集（小红书/抖音跳转）、布料库（多标签+尺寸+购买链接）、电子拼布（拍照识别纸样→区块填布→用料清单）、包包面选布
2. 确定技术方案：PWA（React + TypeScript + Vite + Tailwind + Dexie.js）
3. 确定开发分期：第一期做灵感收纳+布料库，第二期做拼布
4. 确认关键决策：纸样自动识别+手动修正、材质标签代替厚度、包包面自定义命名
5. 生成产品方案描述文档
6. Git 初始化 + GitHub 仓库创建（PatchPalette）
7. 通过 Vite 脚手架创建了项目模板（temp-app 目录）

**当前状态**：项目骨架待整理，依赖待安装

**下一步**：将 temp-app 文件整理到项目根目录，安装依赖，配置 Tailwind CSS 和 PWA

---

### 2026-08-09 — 会话 #2：项目骨架搭建

**时间段**：下午

**本步目标**：
- 清理 temp-app，将文件整合到项目根目录
- 安装所有依赖
- 配置 Tailwind CSS、PWA
- 建立文件夹结构、Tab 导航、数据库模型

**实际做了什么**：
1. 将 temp-app 文件移到根目录，删除临时目录
2. 安装依赖：react, react-dom, react-router-dom, dexie, tailwindcss, @tailwindcss/vite, vite-plugin-pwa
3. 配置 `vite.config.ts`：加入 Tailwind CSS v4 插件 + PWA 插件（含 Service Worker 缓存策略）
4. 配置 `index.html`：中文 lang、viewport-fit=cover、apple-mobile-web-app、主题色
5. 更新 `src/index.css`：Tailwind CSS v4 的 `@import "tailwindcss"` 方式
6. 创建文件夹结构：`src/components/`, `src/pages/`, `src/db/`, `src/hooks/`, `src/utils/`
7. 编写 `src/App.tsx`：底部三 Tab 切换（灵感库 / 布料库 / 拼布）
8. 编写 `src/components/TabBar.tsx`：图标 + 文字标签栏，active 态高亮
9. 编写三个页面组件（Mock 数据占位）：
   - `InspirationPage.tsx`：分类网格展示
   - `FabricLibPage.tsx`：布料列表 + 标签筛选条
   - `PatchworkPage.tsx`：空态占位
10. 编写 `src/db/database.ts`：Dexie.js 数据库，含 Category / Tutorial / Fabric 三张表 + TypeScript 类型定义
11. 删除 Vite 模板遗留文件（App.css、assets 等）
12. TypeScript 类型检查通过（零错误）
13. 更新 README.md

**当前状态**：项目骨架完整，TypeScript 零错误，可在浏览器中运行

**下一步**：开发分类管理 CRUD（创建/编辑/删除分类，关联 Dexie.js 真实数据）

---

### 2026-08-09 — 会话 #3：分类管理 CRUD

**时间段**：下午

**本步目标**：
- 分类的增删改查全部接入 Dexie.js 真实数据库
- 支持拍照/选图做封面
- 底部弹出表单（移动端友好）
- 显示每个分类下的教程数量

**实际做了什么**：
1. 创建 `src/hooks/useCategories.ts`：
   - `load()` 从 Dexie.js 按创建时间倒序加载
   - `add()` 新增分类（自动加入 createdAt 时间戳）
   - `update()` 编辑分类（部分字段更新）
   - `remove()` 删除分类，同时级联删除该分类下的所有教程
2. 创建 `src/components/CategoryForm.tsx`：
   - 底部弹出式模态框（animate-slide-up 动画）
   - 封面图：点击方框 → 调起相机/相册 → FileReader 转 base64 存储
   - 名称（必填）+ 描述（选填）
   - 支持新建和编辑两种模式（通过 initial prop 区分）
3. 重写 `src/pages/InspirationPage.tsx`：
   - 使用 `useCategories()` Hook 替代 Mock 数据
   - 空态引导（无分类时显示占位提示）
   - 每个分类卡片实时显示教程数量（从 tutorials 表 count）
   - 桌面端 hover 显示删除按钮，移动端长按
   - 点击封面 → 编辑该分类
4. `src/index.css`：添加 slide-up 关键帧动画
5. TypeScript 类型检查通过（零错误）

**关键代码位置**：
- 数据操作：`src/hooks/useCategories.ts`
- 表单组件：`src/components/CategoryForm.tsx`
- 页面展示：`src/pages/InspirationPage.tsx`

**当前状态**：分类 CRUD 完成，可在应用中创建/编辑/删除分类，封面图以 base64 存入 IndexedDB

**下一步**：开发布料库功能（多标签系统 + 尺寸 + 图片 + 购买链接）

---

### 2026-08-09 — 会话 #4：布料库功能

**时间段**：下午

**本步目标**：
- 布料增删改查 + 真实数据库
- 多标签系统（预设标签 + 自定义标签 + 标签筛选）
- 尺寸（宽×长 cm）+ 购买链接 + 照片
- 搜索 + 标签过滤

**实际做了什么**：
1. 创建 `src/hooks/useFabrics.ts`：
   - 预设标签常量 PRESET_TAGS：颜色（11个）+ 图案（7个）+ 材质（9个）
   - `add()` 新增布料（自动初始化 usedAreaCm2=0）
   - `update()` / `remove()` / `load()` 标准 CRUD
2. 创建 `src/components/FabricForm.tsx`：
   - 拍照选图（与 CategoryForm 相同模式）
   - 名称 + 宽×长（数字输入，cm 单位）+ 购买链接（URL 输入）
   - 标签多选：预设标签以芯片形式展示，点击切换选中态（蓝底白字/白底灰字）
   - 自定义标签：底部输入框 + 回车或点击添加
   - 编辑模式支持（通过 initial prop 填充已有数据）
3. 重写 `src/pages/FabricLibPage.tsx`：
   - 接入 `useFabrics()` Hook
   - 搜索框：按名称实时过滤
   - 标签筛选栏：横向滚动，"全部" + 从已有布料中收集的独有标签，点击切换
   - 布料列表：缩略图 + 名称 + 尺寸 + 已用量 + 标签小标
   - 空态引导：无布料 / 无匹配结果
   - 点击条目 → 编辑；hover → 显示删除按钮
4. TypeScript 类型检查通过（零错误）

**关键代码位置**：
- 数据操作：`src/hooks/useFabrics.ts`
- 表单组件：`src/components/FabricForm.tsx`
- 页面展示：`src/pages/FabricLibPage.tsx`

**当前状态**：布料库完成，可添加/编辑/删除布料，支持拍照、多标签筛选、搜索、尺寸管理

**下一步**：第一期联调测试，或进入教程收集功能（分类下添加教程条目）

