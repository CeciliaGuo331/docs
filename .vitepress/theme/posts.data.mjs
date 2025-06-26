import { createContentLoader } from 'vitepress'

function calculateReadingInfo(content) {
  if (!content) return { wordCount: 0, readingTime: 0 };

  const body = content.replace(/---[\s\S]*?---/, '');

  // 去除 markdown 语法后计算字数
  const plainText = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*>\s+/gm, '');

  // 中文字符数 + 英文单词数
  const chineseChars = (plainText.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = (plainText.match(/[a-zA-Z]+/g) || []).length;
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
