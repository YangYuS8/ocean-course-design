import * as path from 'node:path';
import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  lang: 'zh',
  title: 'Ocean 课程设计补课站',
  description: '面向 Ocean 课程设计小组的 PHP/Laravel、前端集成与答辩补课文档。',
  icon: '/rspress-icon.png',
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },
  base: '/ocean-course-design/',
  llms: true,
  themeConfig: {
    enableContentAnimation: true,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/YangYuS8/ocean-course-design',
      },
    ],
  },
});
