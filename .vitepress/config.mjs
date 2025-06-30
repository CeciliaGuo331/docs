
import { defineConfig } from 'vitepress'
import { globbySync } from 'globby'
import grayMatter from 'gray-matter'
import path from 'path'
import fs from 'fs'

export function getSidebar() {
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

  function sortItems(items) {
    items.sort((a, b) => {
      const aIsGroup = !!a.items;
      const bIsGroup = !!b.items;
      if (aIsGroup && !bIsGroup) return -1;
      if (!aIsGroup && bIsGroup) return 1;
      return a.text.localeCompare(b.text);
    });
    items.forEach(item => {
      if (item.items) {
        sortItems(item.items);
      }
    });
  }

  sortItems(sidebar);
  return sidebar;
}

function getPosts() {
  const contentDir = path.resolve(process.cwd(), 'content');
  const files = globbySync('**/*.md', {
    cwd: contentDir,
    ignore: ['**/template.md'],
  });

  const posts = files.map(file => {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = grayMatter(fileContent);
    return {
      frontmatter: data,
      url: `/content/${file.replace(/\.md$/, '.html')}`
    };
  }).filter(post => !!post.frontmatter.date);

  posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
  return posts;
}

export default defineConfig({
  title: "sparkles",
  description: "record my life",
  base: '/docs/',
  srcExclude: ['README.md', 'TODO.md'],
  themeConfig: {
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
      message: "aq's days & nights",
      copyright: 'Copyright © 2025 <a href="https://github.com/CeciliaGuo331">CeciliaGuo</a>'
    }
  },
  markdown: {
    lineNumbers: true,
    math: true,
    image: {
      lazyLoading: true
    },
    links: {
      externalAttrs: {
        target: '_self'
      }
    }
  },
  transformPageData(pageData) {
    if (pageData.relativePath === 'index.md') {
      const posts = getPosts();
      if (posts.length > 0) {
        const latestPost = posts[0];
        if (pageData.frontmatter.hero && pageData.frontmatter.hero.actions) {
          pageData.frontmatter.hero.actions[0].link = latestPost.url;
        }
      }
    }
  },

  async buildEnd(siteConfig) {
    console.log('Build finished. Generating posts.json...');
    
    const posts = getPosts();
    
    const outputPath = path.join(siteConfig.outDir, 'posts.json');
    
    fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
    
    console.log(`Successfully generated posts.json at ${outputPath}`);
  }
})
