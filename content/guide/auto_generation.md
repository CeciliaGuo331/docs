---
title: 自动化内容生成指南
date: '2025-06-26'
details: 介绍本博客的内容自动化工作流
---
# 自动化内容生成指南

本文档介绍本博客的内容自动化工作流。该系统采用了一种混合模式，结合了 VitePress 的同步配置和异步数据加载，以实现稳定、高效的内容管理。

## ✨ 工作原理

整个自动化流程分为两个并行部分：

1. **侧边栏生成 (同步)**:
    * 当您启动开发服务器 (`npm run docs:dev`) 或构建项目时，`.vitepress/config.mjs` 文件中的 `getSidebar` 函数会**立即、同步地**扫描 `content` 目录。
    * 它会读取所有文章的元数据，并根据目录结构生成侧边栏配置。这个过程是即时的，以确保 VitePress 服务器能正确启动。

2. **页面内容加载 (异步, 支持热重载)**:
    * 对于像首页文章列表这样的动态组件，我们使用 `.vitepress/theme/posts.data.mjs` 文件。
    * 它利用 VitePress 的 `createContentLoader` API **异步**加载文章内容。
    * 在开发模式下，当您修改 Markdown 文件时，这个机制支持**热重载 (Hot-reload)**，您无需刷新浏览器就能看到文章列表的更新。

这种混合设计，确保了服务器启动的稳定性和开发体验的流畅性。

## 📝 文章元数据 (Frontmatter)

为了让两个自动化流程都能正确识别和处理您的文章，请务必在每个 `.md` 文件顶部添加 `frontmatter`。

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

* `title`: **(必需)** 文章的正式标题。
* `date`: **(必需)** 文章的发布日期。
* `details`: **(必需)** 文章摘要，用于在列表页显示。
* `tags`: **(可选)** 文章的标签数组，主要由 `posts.data.mjs` 使用。

## 🛠️ 核心自动化逻辑

项目的自动化由以下两个核心文件驱动：

### 1. `.vitepress/config.mjs` (用于侧边栏)

* **功能**: 同步生成侧边栏。
* **实现**: 包含一个 `getSidebar` 函数，该函数：
  * 使用 `globbySync` 库同步扫描 `content/**/*.md` 文件。
  * 自动忽略 `template.md` 文件。
  * 解析每篇文章的 Frontmatter，提取 `title` 和 `category`。
  * 构建并返回 VitePress 所需的侧边栏数据结构。

### 2. `.vitepress/theme/posts.data.mjs` (用于页面组件)

* **功能**: 为 Vue 组件提供异步、可热重载的文章数据。
* **实现**: 使用 VitePress 的 `createContentLoader` API：
  * 监听 `content/**/*.md` 文件的变化。
  * 解析完整的 Frontmatter 和内容，计算阅读时间等信息。
  * 将所有文章数据排序并导出为一个模块，供 `ArticleList.vue` 等组件使用。

## 🧩 数据消费

* **侧边栏**: 直接在 `.vitepress/config.mjs` 中由 `getSidebar()` 函数的返回值提供。
* **前端组件**: 像 `ArticleList.vue` 这样的组件，通过 `import { data as posts } from '../posts.data.mjs'` 来直接获取完整的文章数据数组并进行渲染。

## 🔧 自定义配置

* **若要修改侧边栏** (如分类逻辑、排序等)，请编辑 `.vitepress/config.mjs` 中的 `getSidebar` 函数。
* **若要修改文章列表显示的内容** (如增减元数据、调整阅读时间计算等)，请编辑 `.vitepress/theme/posts.data.mjs`。
