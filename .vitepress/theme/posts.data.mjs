import { createContentLoader } from 'vitepress'

export default createContentLoader('content/**/*.md', {
  excerpt: true,
  transform(raw) {
    return raw
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title,
        url,
        date: frontmatter.date ? new Date(frontmatter.date) : new Date(),
        linkText: frontmatter.linkText, // 新增
        details: frontmatter.details,   // 新增
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
  },
})
