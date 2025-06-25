import { createContentLoader } from 'vitepress'

function calculateReadingInfo(content) {
  if (!content) return { wordCount: 0, readingTime: 0 };
  const contentOnly = content.replace(/---[\s\S]*?---/, '').trim();
  const chineseChars = (contentOnly.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (contentOnly.match(/[a-zA-Z0-9_'-]+/g) || []).length;
  const wordCount = chineseChars + englishWords;
  const readingTime = Math.ceil(wordCount / 300) || 1;
  return { wordCount, readingTime };
}

export default createContentLoader('content/**/*.md', {
  ignore: ['**/template.md'],
  includeSrc: true,
  transform(raw) {
    return raw
      .map((data) => {
        const { url, frontmatter, src } = data;
        const { wordCount, readingTime } = calculateReadingInfo(src);
        const urlParts = url.split('/');
        const category = urlParts.length === 3 ? 'main' : urlParts[2];
        return {
          title: frontmatter.title,
          url,
          date: frontmatter.date ? new Date(frontmatter.date) : new Date(),
          details: frontmatter.details,
          tags: frontmatter.tags || [],
          category: category,
          wordCount: wordCount,
          readingTime: readingTime,
        }
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime())
  },
})
