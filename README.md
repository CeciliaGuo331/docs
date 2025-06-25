# sparkles

这是一个使用 [VitePress](https.vitepress.dev) 构建的个人文档网站。

## 项目描述

该项目用于记录生活点滴和想法，网站标题为 "sparkles"。

## 如何运行

1. **安装依赖:**

    ```bash
    npm install
    ```

2. **本地开发:**
    启动开发服务器，实时预览更改。

    ```bash
    npm run docs:dev
    ```

3. **构建项目:**
    将文档网站构建为静态文件，以便部署。

    ```bash
    npm run docs:build
    ```

4. **预览构建结果:**
    在本地预览构建好的网站。

    ```bash
    npm run docs:preview
    ```

## 项目结构

- `.vitepress/`: 存放 VitePress 的配置。
  - `config.mjs`: 定义了网站的标题、导航和侧边栏等。
  - `theme/`: 用于存放自定义主题文件。
- `content/`: 存放所有 Markdown 内容文件。
  - `guide/`: 存放项目使用指南和规范。
  - `idea/`: 用于记录个人想法和感悟。
  - `note/`: 用于存放学习笔记和知识整理。
- `image/`: 存放项目中使用的图片资源。
- `package.json`: 定义了项目依赖和脚本命令。
