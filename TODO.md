# 文档站优化待办事项 (TODO)

本文档记录了针对当前 VitePress 站点在功能、性能和维护方面可以进行的优化建议。

---

## ✨ 功能与用户体验优化 (Functionality & UX)

- [ ] **启用本地搜索功能**
  - **问题**: 当前站点缺少内容搜索功能，当文章增多时，用户难以快速找到信息。
  - **建议**: 在 `.vitepress/config.mjs` 中配置 `themeConfig.search`，启用 VitePress 内置的、基于 MiniSearch 的离线搜索功能。这是一个低成本、高回报的体验优化。

- [ ] **显示页面最后更新时间**
  - **问题**: 用户无法判断一篇文章内容的“新鲜度”。
  - **建议**: 在 `themeConfig` 中开启 `lastUpdated: true`。VitePress 会自动基于 Git 的提交历史来显示每篇文章的最后更新时间，增强内容的可信度。

- [ ] **增强 SEO 和社交分享**
  - **问题**: 页面的 HTML head 中缺少 Open Graph (OG) 等 meta 标签，不利于在社交媒体（如 Twitter, Facebook）上分享链接时生成丰富的预览卡片。
  - **建议**: 利用 VitePress 的 `head` 配置，或者 `transformHead` 构建钩子，为每个页面动态添加 `og:title`, `og:description`, `og:image` 等标签。

- [ ] **创建文章归档页**
  - **问题**: 除了侧边栏，缺少一个可以概览所有文章的中心页面。
  - **建议**: 创建一个 `/archive.md` 页面，利用我们已经实现的 `posts.json` API 或 `transformPageData` 钩子，将所有文章按年份或标签进行分组和展示，提供一个完整的博客归档视图。

## ⚡️ 性能优化 (Performance)

- [ ] **自动化图像压缩与格式转换**
  - **问题**: 目前图片资源直接使用，可能存在体积过大、格式老旧的问题。
  - **建议**: 引入一个 Vite 图像优化插件（如 `vite-plugin-imagemin`），在构建时自动压缩图片，并可以考虑生成 `.webp` 等下一代格式，以减少页面加载体积。

- [ ] **分析并监控构建包体积**
  - **问题**: 项目依赖增多后，可能会无意中引入过大的库，影响客户端性能。
  - **建议**: 引入 `rollup-plugin-visualizer` 等打包分析工具，在构建后生成一份可视化的依赖关系图，帮助分析哪些依赖占据了最大的体积，以便进行针对性优化。

## 🛠️ 开发与维护优化 (Development & Maintenance)

- [ ] **重构构建时脚本**
  - **问题**: 目前 `getSidebar` 和 `getPosts` 等数据获取函数直接写在 `config.mjs` 中，当逻辑变复杂时，会让配置文件显得臃肿。
  - **建议**: 创建一个 `.vitepress/theme/utils.js` 或类似的文件，将这些数据处理函数移入其中，然后在 `config.mjs` 中导入并调用。这能让配置更清晰，逻辑更模块化。

- [ ] **定义并校验 Frontmatter 结构**
  - **问题**: 文章的 `frontmatter` 依赖于开发者手动保证其正确性，容易出现拼写错误或缺少字段。
  - **建议**: 可以引入 `zod` 等校验库，在 `getPosts` 函数中对每篇文章的 `frontmatter` 进行校验。如果结构不符合预定义的 schema（例如，缺少 `date` 字段），就在构建时抛出明确的错误，提早发现问题。

- [ ] **启用 GitHub Dependabot**
  - **问题**: 项目的NPM依赖会随着时间变得陈旧，可能包含安全漏洞或性能问题。
  - **建议**: 在 GitHub 仓库的 `Security` 标签页下，启用 Dependabot。它会自动检测过期的依赖，并创建 Pull Request 来更新它们，帮助项目保持最新和安全。
