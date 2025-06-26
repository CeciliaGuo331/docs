---
title: 跨站点内容共享：使用静态JSON作为API的实现指南
date: '2025-06-26'
details: 本指南介绍了一种通过在构建时生成静态JSON文件，将VitePress站点内容共享给其他网站的方法，并提供了解决GitHub Actions中缓存问题的方案。
---

# 跨站点内容共享：使用静态 JSON 作为 API 的实现指南

本指南详细介绍了一种高效、可靠的架构模式，用于将一个基于 VitePress 的站点（内容源）的文章列表，共享给任何外部静态网站（内容消费端）。

该模式的核心是创建一个在**网站构建时**生成的静态 `posts.json` 文件，它将作为对外开放的、只读的“内容 API”。

## ✨ 架构模式：静态化的“内容 API”

在处理两个独立的静态网站（例如 VitePress 站点与一个主站点）之间的内容共享时，部署一个传统的动态 API 服务会增加不必要的复杂性和成本。一个更优的模式是利用静态网站生成器的构建过程：

1.  **构建时生成数据**：在内容源站的构建流程中，通过脚本扫描所有文章，提取其元数据（`frontmatter`），并生成一个包含所有文章信息的 `posts.json` 文件。
2.  **静态文件即 API**：将此 `posts.json` 文件与网站的其他静态资源（HTML, CSS）一同部署。该文件便拥有了一个公开的、可通过 URL 访问的静态数据端点。
3.  **外部网站消费数据**：任何外部网站都可以通过标准的 `fetch` API 异步请求这个 `posts.json` 的 URL，获取文章数据并在客户端进行渲染。

此模式充分利用了静态网站的优势：性能卓越、零服务器成本、易于部署和维护。

## 🛠️ 实现步骤

### 第一部分：API 端开发 (VitePress 站点)

此部分的目标是在每次构建时，自动在输出目录中生成 `posts.json`。

#### 1. 修改 VitePress 配置

此功能的实现依赖于 VitePress 提供的 `buildEnd` 构建钩子。编辑 `.vitepress/config.mjs` 文件，添加相应的逻辑。

```javascript
// .vitepress/config.mjs

import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
// 确保已有一个 getPosts 函数，用于扫描和返回所有文章数据
// import { getPosts } from './theme/utils' 

export default defineConfig({
  // ... 其他 VitePress 配置

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

在 CI/CD 环境（如 GitHub Actions）中，为了加速构建，通常会启用缓存。这可能导致一个问题：当只修改文章内容（例如 `frontmatter` 中的日期）而不改变项目依赖时，构建系统可能会使用旧的缓存，导致 `posts.json` 未能更新。

VitePress 在构建时会使用 `.vitepress/cache` 目录存放编译的中间产物和元数据快照。如果这个目录被 CI 缓存并复用，`buildEnd` 钩子可能会在过时的数据基础上运行。

**解决方案：** 在执行构建命令之前，强制清除 VitePress 的缓存目录。

修改您的 GitHub Actions 工作流文件（例如 `.github/workflows/deploy.yml`）：

```yaml
# .github/workflows/deploy.yml

# ... (其他步骤)

      - name: Build with VitePress
        # 在构建命令前，强制删除旧的缓存目录，确保构建的全新性
        run: rm -rf .vitepress/cache && npm run docs:build

# ... (其他步骤)
```

这个命令确保了每次自动化构建都是一次完整的、不受旧缓存影响的构建，从而保证了 `posts.json` 数据的准确性。

### 第二部分：API 消费端 (外部网站)

在任何外部网站的 HTML 文件中，都可以使用标准的 `fetch` API 来获取并渲染文章列表。

```html
<!-- 示例：在主站的 index.html 中 -->

<!-- 1. 准备一个用于填充文章的 HTML 容器 -->
<div id="latest-posts-container">
  <p>Loading latest posts...</p>
</div>

<!-- 2. 添加获取和渲染数据的脚本 -->
<script>
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
        container.innerHTML = '';
        const recentPosts = posts.slice(0, 3); // 仅显示最新的3篇文章
        
        if (recentPosts.length === 0) {
          container.innerHTML = '<p>No posts found.</p>';
          return;
        }

        recentPosts.forEach(post => {
          const postElement = document.createElement('div');
          postElement.className = 'post-preview'; // 定义样式类名
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

## 结论与最佳实践

- **更新流程**：此架构下的内容更新流程高度自动化。开发者只需在 VitePress 项目中修改或添加文章，并将代码推送到 Git 仓库的主分支。CI/CD 流水线会自动完成构建、缓存清理和部署的全过程。
- **数据契约**：`posts.json` 的数据结构是内容源与消费端之间的“契约”。对 `frontmatter` 字段的任何修改都需要同步更新消费端的 JavaScript 代码。
- **健壮性**：消费端的 `fetch` 调用应包含全面的错误处理逻辑（如 `.catch` 块），以优雅地处理网络问题或 API 文件不存在的情况。
