# 自动化内容生成指南

本文档介绍本博客的内容自动化工作流。该系统旨在将内容创作与数据展示完全分离，让您只需专注于写作。

## ✨ 工作原理

整个自动化流程可以概括为四个步骤：

1.  **✍️ 撰写文章**: 您只需在 `content` 目录下创建 Markdown 文件，并在文件头部添加必要的元数据 (Frontmatter)。脚本会自动忽略所有名为 `template.md` 的文件。
2.  **⚙️ 运行命令**: 当您在本地运行 `npm run docs:dev` 或在服务器上构建 `npm run docs:build` 时，自动化脚本会自动执行。
3.  **📊 生成数据**: 脚本会扫描所有文章，提取元数据，并生成两个结构化的 JSON 文件 (`articles.json` 和 `sidebar.json`)。这些文件保存在 `/public` 目录下。
4.  **🖼️ 渲染页面**: VitePress 配置和特定的 Vue 组件会读取这些 JSON 文件，并将数据动态渲染到页面上。

## 📝 文章元数据 (Frontmatter)

为了让自动化脚本正确识别和处理您的文章，请务必在每个 `.md` 文件顶部添加 `frontmatter`。

**示例:**

```yaml
---
title: "在这里输入标题"
date: YYYY-MM-DD
details: "在这里写下想法的简要描述"
tags: ["标签1", "标签2"]
---
```

**字段说明:**

*   `title`: **(必需)** 文章的正式标题。
*   `date`: **(必需)** 文章的发布日期。
*   `details`: **(必需)** 文章摘要，用于在列表页显示。
*   `tags`: **(可选)** 文章的标签数组。

## 🛠️ 核心自动化脚本

*   **脚本位置**: `scripts/generate-content-data.mjs`
*   **主要功能**:
    *   扫描 `content` 目录下的所有文章（忽略 `template.md`）。
    *   解析每篇文章的 Frontmatter。
    *   计算统计数据（如字数、阅读时间）。
    *   生成供前端使用的数据文件。

## 📦 生成的数据文件

自动化脚本会生成以下文件，供前端使用：

*   `/public/articles.json`: 所有文章的详细列表，包含完整的元数据。此文件中的 `url` 字段带有 `/docs/` 前缀，主要用于主页的文章列表。
*   `/public/sidebar.json`: VitePress 侧边栏的配置文件。此文件中的 `link` 字段不带 `/docs/` 前缀，以确保侧边栏导航正确。

## 🧩 数据消费

生成的数据主要通过以下方式消费：

*   **VitePress 侧边栏**: `.vitepress/config.mjs` 直接导入并使用 `/public/sidebar.json` 来动态生成侧边栏。
*   **前端组件**: 自定义 Vue 组件（如文章列表）可以获取并渲染 `/public/articles.json` 的内容。

## 🔧 自定义配置

如果您需要调整自动化行为，可以修改核心脚本 `scripts/generate-content-data.mjs`，例如：

*   更改扫描的目录或忽略规则。
*   调整数据输出路径或格式。
*   修改统计信息的计算逻辑。
