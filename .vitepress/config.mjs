import { defineConfig } from 'vitepress'
import { globbySync } from 'globby'
import grayMatter from 'gray-matter'
import path from 'path'
import fs from 'fs'

function getSidebar() {
  const contentDir = path.resolve(process.cwd(), 'content');
  const files = globbySync('**/*.md', {
    cwd: contentDir,
    ignore: ['**/template.md'],
  });

  const posts = files.map(file => {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = grayMatter(fileContent);
    const category = path.dirname(file).split('/')[0];

    return {
      title: data.title || 'Untitled',
      category: category === '.' ? 'main' : category,
      url: `/content/${file.replace(/\.md$/, '.html')}`
    }
  });

  const sidebar = posts.reduce((acc, post) => {
    let categoryEntry = acc.find((c) => c.text === post.category);
    if (!categoryEntry) {
      categoryEntry = {
        text: post.category,
        items: [],
        collapsed: true,
      };
      acc.push(categoryEntry);
    }
    categoryEntry.items.push({
      text: post.title,
      link: post.url,
    });
    return acc;
  }, []);

  sidebar.sort((a, b) => a.text.localeCompare(b.text));
  sidebar.forEach(category => {
    category.items.sort((a, b) => a.text.localeCompare(b.text));
  });

  return sidebar;
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "sparkles",
  description: "record my life",
  base: '/docs/',
  srcExclude: ['README.md', 'TODO.md'],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: 'https://ceciliaguo331.github.io/', target: '_self' },
      { text: 'Sparkles', link: '/' },
      { text: 'Aboutme', link: 'https://ceciliaguo331.github.io/aboutme.html', target: '_self' },
      { text: 'Friends', link: 'https://ceciliaguo331.github.io/friends.html', target: '_self' },
    ],

    sidebar: getSidebar(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/CeciliaGuo331' }
    ],

    footer: {
      message: 'aq\'s days & nights',
      copyright: 'Copyright © 2025 <a href="https://github.com/CeciliaGuo331">CeciliaGuo</a>'
    },
    markdown: {
      lineNumbers: true,
      math: true,
      image: {
        lazyLoading: true
      },
    }
  }
})
