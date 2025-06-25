
import fs from 'fs-extra';
import path from 'path';
import { globby } from 'globby';
import grayMatter from 'gray-matter';
import readingTime from 'reading-time';

const contentDir = path.join(process.cwd(), 'content');
const publicDir = path.join(process.cwd(), 'public');

async function generateContentData() {
  const files = await globby('**/*.md', { cwd: contentDir });

  const articles = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data, content } = grayMatter(fileContent);
      const stats = readingTime(content);
      const url = `/content/${file.replace(/\.md$/, '.html')}`;
      const category = path.dirname(file).split('/')[0];

      return {
        title: data.title,
        url,
        date: data.date,
        description: data.details,
        category: category === '.' ? 'main' : category,
        tags: data.tags || [],
        wordCount: stats.words,
        readingTime: Math.ceil(stats.minutes),
      };
    })
  );

  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  await fs.ensureDir(publicDir);

  // For articles.json, urls need to be prefixed with /docs/
  const articlesForJson = articles.map(article => ({
    ...article,
    url: `/docs${article.url}`
  }));
  await fs.writeJson(path.join(publicDir, 'articles.json'), articlesForJson, { spaces: 2 });

  // For sidebar.json, urls should not be prefixed
  const sidebar = articles.reduce((acc, article) => {
    let categoryEntry = acc.find((c) => c.text === article.category);
    if (!categoryEntry) {
      categoryEntry = {
        text: article.category,
        items: [],
        collapsed: true,
      };
      acc.push(categoryEntry);
    }
    categoryEntry.items.push({
      text: article.title,
      link: article.url,
    });
    return acc;
  }, []);

  await fs.writeJson(path.join(publicDir, 'sidebar.json'), sidebar, { spaces: 2 });

  console.log(' Content data generated successfully!');
}

generateContentData();
