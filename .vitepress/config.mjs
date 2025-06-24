import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "sparkles",
  description: "record my life",
  base: '/docs/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Contents', link: '/' },
      { text: 'Home', link: 'https://ceciliaguo331.github.io/', target: '_self' },
    ],

    sidebar: [
      {
        text: 'Idea',
        items: [
          { text: '2024', link: '/content/idea/2024' }
        ]
      },
      {
        text: 'Note',
        items: [
          { text: '北欧高福利经济掠影', link: '/content/note/北欧高福利经济掠影.md' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/CeciliaGuo331' }
    ]
  }
})
