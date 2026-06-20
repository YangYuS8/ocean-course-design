import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// main.tsx 是 React 应用入口。
// Vite 会先加载 index.html，再执行这里的代码，把 App 组件挂载到 <div id="root"></div> 中。
createRoot(document.getElementById('root')!).render(
  // StrictMode 是 React 的开发辅助工具，会帮助发现潜在问题；生产构建不会影响页面功能。
  <StrictMode>
    <App />
  </StrictMode>,
)
