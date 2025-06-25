---
title: 自动化内容生成指南
date: '2025-06-26'
details: 介绍本博客的内容自动化工作流
---
# 自动化内容生成指南

本文档介绍本博客的内容自动化工作流。该系统利用 VitePress 内置的数据加载器，实现了高效、实时的内容管理，让您只需专注于写作。

## ✨ 工作原理

整个自动化流程完全集成在 VitePress 的生命周期中：

1. **✍️ 撰写文章**: 您只需在 `content` 目录下创建或修改 Markdown 文件。VitePress 会自动监测这些文件的变化。
2. **⚙️ 实时处理**: 在开发模式下 (`npm run docs:dev`)，VitePress 的数据加载器会**实时**扫描所有文章，提取元数据，并应用转换逻辑。所有更改都会**热重载 (Hot-reload)**，无需手动刷新。
3. **📦 数据注入**: 处理后的数据被转换成一个名为 `posts.data.mjs` 的模块。这个模块可以在任何 VitePress 页面或组件中直接导入和使用。
4. **🖼️ 动态渲染**: Vue 组件（如文章列表）和 VitePress 配置（如侧边栏）直接从 `posts.data.mjs` 模块中获取数据，动态渲染页面内容。

## 📝 文章元数据 (Frontmatter)

为了让数据加载器正确识别和处理您的文章，请务必在每个 `.md` 文件顶部添加 `frontmatter`。

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
* `tags`: **(可选)** 文章的标签数组。

## 🛠️ 核心数据加载器

* **文件位置**: `.vitepress/theme/posts.data.mjs`
* **核心功能**:
  * 使用 VitePress 的 `createContentLoader` API 监听 `content/**/*.md` 文件。
  * 自动忽略 `template.md` 文件。
  * 解析每篇文章的 Frontmatter。
  * 计算阅读时间、字数等统计信息。
  * 将所有文章数据排序并导出为一个模块。

## 🧩 数据消费

与旧方法不同，新架构**不再生成任何静态 JSON 文件**。数据消费通过直接导入模块来完成：

* **VitePress 侧边栏**: `.vitepress/config.mjs` 文件导入 `posts.data.mjs`，并动态生成侧边栏结构。
* **前端组件**: 任何需要文章数据的 Vue 组件（如 `ArticleList.vue`）都可以通过 `import { data as posts } from '../posts.data.mjs'` 来直接获取所有文章数据并进行渲染。

## 🔧 自定义配置

如果您需要调整自动化行为，可以直接修改核心数据加载器 `.vitepress/theme/posts.data.mjs`，例如：

* 修改 `createContentLoader` 的 glob 模式以更改扫描范围。
* 在 `transform` 函数中调整数据处理逻辑，例如添加新的元数据或修改计算方式。
