
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

  const sidebar = [];

  files.forEach(file => {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = grayMatter(fileContent);

    const pathSegments = path.dirname(file).split('/').filter(p => p !== '.' && p !== '');

    let currentLevel = sidebar;

    // Handle root-level files by creating a 'main' category
    if (pathSegments.length === 0) {
      pathSegments.push('main');
    }

    pathSegments.forEach(segment => {
      let node = currentLevel.find(item => item.text === segment && item.items);
      if (!node) {
        node = {
          text: segment,
          items: [],
          collapsed: true
        };
        currentLevel.push(node);
      }
      currentLevel = node.items;
    });

    currentLevel.push({
      text: data.title || 'Untitled',
      link: `/content/${file.replace(/\.md$/, '.html')}`
    });
  });

  // Recursive sort function
  function sortItems(items) {
    items.sort((a, b) => {
      // Directories first
      const aIsGroup = !!a.items;
      const bIsGroup = !!b.items;
      if (aIsGroup && !bIsGroup) return -1;
      if (!aIsGroup && bIsGroup) return 1;
      // Then by text
      return a.text.localeCompare(b.text);
    });
    // Sort sub-items recursively
    items.forEach(item => {
      if (item.items) {
        sortItems(item.items);
      }
    });
  }

  sortItems(sidebar);
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
    appearance: 'light',
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
    }
  },
  markdown: {
    lineNumbers: true,
    math: true,
    image: {
      lazyLoading: true
    },
  }
})
