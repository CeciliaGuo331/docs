import { defineConfig } from 'vitepress'
import sidebar from '../public/sidebar.json'

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

    sidebar: sidebar,

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