---
title: 跨站点内容共享API指南
date: '2025-06-26'
details: 介绍如何通过构建时生成的JSON文件，将本站内容共享给其他网站，并解决GitHub Actions中的缓存问题。
---

# 跨站点内容共享 API 指南

本文档详细介绍了一种高效、可靠的方法，用于将本 VitePress 站点（文档站）的最新文章列表，共享给任何外部网站（例如您的个人主页）。

我们将创建一个在**网站构建时**生成的静态 `posts.json` 文件，它将作为我们对外开放的只读“内容 API”。

## ✨ 核心理念：静态化的“内容API”

对于两个独立的静态网站（例如 VitePress 搭建的 `docs` 站和您的主站点），传统动态 API 并不适用。我们的核心思路是：

1.  **构建时生成数据**：在 `docs` 站的构建过程中，扫描所有文章，提取 `frontmatter`（标题、日期、摘要等），并生成一个包含所有文章信息的 `posts.json` 文件。
2.  **静态文件即 API**：将这个 `posts.json` 文件与网站的 HTML, CSS 等静态资源一同部署。它便成了一个公开的、可通过 URL 访问的静态数据源。
3.  **外部网站消费数据**：任何外部网站（如您的主页）都可以通过 `fetch` API 请求这个 `posts.json` 的 URL，获取文章数据并进行展示。

这种方法完全利用了静态网站的优势：性能卓越、零成本、易于部署和维护。

## 🛠️ 实现步骤：API 的生成与消费

### 第一部分：API 端开发 (本文档站)

此部分的目标是在每次构建时，自动生成 `posts.json`。

#### 1. 修改 VitePress 配置

我们需要利用 VitePress 的 `buildEnd` 构建钩子。编辑 `.vitepress/config.mjs` 文件：

```javascript
// .vitepress/config.mjs

import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
// 确保您已经有 getPosts 函数，用于扫描和返回所有文章数据
// import { getPosts } from './theme/utils' 

export default defineConfig({
  // ... 您的其他 VitePress 配置

  // --- 新增的核心逻辑 ---
  async buildEnd(siteConfig) {
    console.log('Build finished. Generating posts.json...');
    
    // 1. 获取所有文章的数据
    const posts = await getPosts(); // 假设 getPosts 已被正确实现
    
    // 2. 定义输出路径 (通常是 .vitepress/dist/posts.json)
    const outputPath = path.join(siteConfig.outDir, 'posts.json');
    
    // 3. 将文章数据格式化并写入文件
    fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
    
    console.log(`Successfully generated posts.json at ${outputPath}`);
  }
})
```

#### 2. 解决自动化部署中的缓存问题 (关键)

在自动化部署环境（如 GitHub Actions）中，为了加速构建，通常会缓存项目依赖和构建产物。但这会导致一个问题：**当我们只修改文章内容（如日期）而不改变项目依赖时，缓存可能不会失效，导致 `posts.json` 无法更新。**

VitePress 在构建时会使用 `.vitepress/cache` 目录存放中间产物和元数据快照。如果这个缓存被复用，`buildEnd` 钩子可能会拿到旧的数据。

**解决方案：** 在构建前强制清除 VitePress 的缓存。

修改您的 GitHub Actions 工作流文件（例如 `.github/workflows/deploy.yml`）：

```yaml
# .github/workflows/deploy.yml

# ... (其他步骤)

      - name: Build with VitePress
        # 在构建命令前，强制删除旧的缓存目录
        run: rm -rf .vitepress/cache && npm run docs:build

# ... (其他步骤)
```

这个简单的命令确保了每次自动化构建都是一次全新的构建，从而保证了 `posts.json` 的数据永远是最新的。

### 第二部分：API 端消费 (外部网站)

在您的主站点（或其他任何网站）的 HTML 文件中，使用 JavaScript 的 `fetch` API 来获取并渲染文章列表。

```html
<!-- 例如：在您的主页 index.html 中 -->

<!-- 1. 准备一个用于填充文章的容器 -->
<div id="latest-posts-container">
  <!-- 加载状态提示 -->
  <p>Loading latest posts...</p>
</div>

<!-- 2. 添加获取数据的脚本 -->
<script>
  // API 的 URL 地址
  const API_URL = 'https://ceciliaguo331.github.io/docs/posts.json';

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('latest-posts-container');

    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(posts => {
        // 清空容器
        container.innerHTML = '';
        
        // 只显示最新的 3 篇文章
        const recentPosts = posts.slice(0, 3);
        
        if (recentPosts.length === 0) {
          container.innerHTML = '<p>No posts found.</p>';
          return;
        }

        recentPosts.forEach(post => {
          const postElement = document.createElement('div');
          postElement.className = 'post-preview'; // 样式类名
          postElement.innerHTML = `
            <a href="https://ceciliaguo331.github.io/docs${post.url}">
              <h2>${post.frontmatter.title}</h2>
              <p>${post.frontmatter.details}</p>
            </a>
            <p><em>Posted on ${new Date(post.frontmatter.date).toLocaleDateString()}</em></p>
          `;
          container.appendChild(postElement);
        });
      })
      .catch(error => {
        console.error('Failed to fetch posts:', error);
        container.innerHTML = '<p>Could not load posts at the moment. Please try again later.</p>';
      });
  });
</script>
```

## 总结与注意事项

- **更新流程**：要更新主页上的文章列表，您只需在本文档站中修改或添加文章，然后将代码 `push` 到主分支。GitHub Actions 会自动完成构建、缓存清理和部署的全过程。
- **数据契约**：`posts.json` 的数据结构是前后端的“契约”。如果修改了 `frontmatter` 中的字段，需要同步更新消费端的 JavaScript 代码。
- **健壮性**：消费端的 `fetch` 代码中应包含完整的错误处理（`.catch` 块），以应对网络问题或 API 文件不存在的情况。
