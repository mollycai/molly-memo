# Molly Memo Generator & Editor

**Molly Memo** 是一个基于 AI 的表情包生成与编辑器。旨在通过智能识别图片情绪并推荐“神配文”，让表情包制作变得极其简单和有趣。

## 1. 简介 (Introduction)

本项目是一个 **MVP (Minimum Viable Product)** 版本的 Web 应用，纯 Vibe Coding 开发。
*   **核心功能**：图片上传 -> AI 智能配文 -> 在线编辑 (Canvas) -> 一键生成表情包。
*   **用户体系**：支持 **微信快捷登录**（非强制），登录后可查看历史创作记录；未登录用户可直接以游客身份使用所有生成/编辑功能。
*   **目标场景**：斗图救急、自媒体素材制作、趣味图片二创。

## 2. 技术栈 (Tech Stack)

本项目采用现代化的 React 全栈开发架构：

*   **框架**: [Next.js 16 (App Router)](https://nextjs.org/) - 服务端渲染与 API 路由一体化。
*   **语言**: [TypeScript](https://www.typescriptlang.org/) - 强类型保障代码质量。
*   **样式**: [Tailwind CSS v4](https://tailwindcss.com/) - 原子化 CSS，快速构建 UI。
*   **组件库**: [shadcn/ui](https://ui.shadcn.com/) - 基于 Radix UI 和 Tailwind 的可复制组件集合。
*   **状态管理**: [Zustand](https://github.com/pmndrs/zustand) - 轻量级、极简的全局状态管理。
*   **图形处理**: [Fabric.js](http://fabricjs.com/) - 强大的 HTML5 Canvas 库，用于图片合成与文字编辑。
*   **AI 能力**: (计划接入) OpenAI / Gemini / 通义千问 VL 模型。

## 3. 目录结构 (Project Structure)

```text
molly-memo/
├── src/
│   ├── app/                 # Next.js App Router 页面路由
│   │   ├── api/             # 后端 API 接口 (Next.js Route Handlers)
│   │   ├── create/          # 图片上传与创建页面
│   │   └── editor/          # 编辑器核心页面
│   ├── components/          # React 组件
│   │   └── ui/              # shadcn/ui 基础组件
│   └── lib/                 # 工具函数与全局状态配置
├── public/                  # 静态资源
├── next.config.ts           # Next.js 配置文件
├── package.json             # 依赖管理
└── README.md                # 项目文档
```

## 4. 开发规范 (Guidelines)

为了保持代码整洁和一致性，请遵循以下规范：

*   **组件开发**：
    *   严格使用 **函数式组件 (Functional Components)** + Hooks，禁止使用 Class 组件。
    *   组件文件名采用 `PascalCase` (如 `MemeEditor.tsx`)。
*   **TypeScript**：
    *   **No `any`**：尽量避免使用 `any` 类型，所有 Props 和 State 都要有明确的类型定义（定义在 `src/types` 或组件同级）。
*   **样式编写**：
    *   **Tailwind First**：所有样式优先使用 Tailwind Utility Classes。
    *   **禁止 CSS Modules**：除非极特殊情况，不要写 `.css` 或 `.module.css` 文件。
    *   复杂类名拼接使用 `cn()` 工具函数 (基于 `clsx` + `tailwind-merge`)。
*   **状态管理**：
    *   组件内部状态用 `useState`。
    *   跨组件共享状态（如图片数据、生成的文案）必须使用 `Zustand` Store。
*   **API 调用**：
    *   所有对后端的 fetch 请求封装在 `src/lib/api.ts` 中，页面中只调用封装好的函数。

## 5. 如何运行 (How to Run)

确保你的环境已安装 Node.js (推荐 v20+) 和 pnpm。

1.  **安装依赖**：
    ```bash
    pnpm install
    ```

2.  **启动开发服务器**：
    ```bash
    pnpm dev
    ```
    打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可看到项目。

3.  **构建生产版本**：
    ```bash
    pnpm build
    pnpm start
    ```

## 6. 设计风格 (Design System)

遵循 **Apple 极简主义** 设计语言，以内容为中心。

*   **视觉 (Visual)**：黑白灰主色调，大圆角 (`rounded-2xl/full`)，微阴影与毛玻璃质感。
*   **排版 (Typography)**：优先使用 **PingFang SC** (苹方)，保持清晰易读。
*   **适配 (Responsive)**：**移动端优先 (Mobile First)**，Web 端采用容器居中布局模拟 App 体验。
