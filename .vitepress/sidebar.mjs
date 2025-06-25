import fs from 'fs'
import path from 'path'

const contentRoot = path.resolve(process.cwd(), 'content')

function getSidebarItems(dir) {
  const dirPath = path.join(contentRoot, dir)
  if (!fs.existsSync(dirPath)) {
    return []
  }

  return fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.md') && file.toLowerCase() !== 'template.md')
    .map(file => {
      const fileNameWithoutExt = file.replace(/\.md$/, '')
      return {
        text: fileNameWithoutExt,
        link: `/content/${dir}/${fileNameWithoutExt}`
      }
    })
}

export function generateSidebar() {
  const topLevelDirs = fs.readdirSync(contentRoot).filter(item => {
    const itemPath = path.join(contentRoot, item)
    return fs.statSync(itemPath).isDirectory()
  })

  return topLevelDirs.map(dir => ({
    text: dir.charAt(0).toUpperCase() + dir.slice(1),
    items: getSidebarItems(dir)
  }))
}
