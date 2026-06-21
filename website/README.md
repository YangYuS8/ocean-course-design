# Ocean 课程设计补课站

这是本项目单独的 Rspress 文档站，面向组员学习和答辩准备。

## 本地开发

```bash
cd website
pnpm install
pnpm run dev
```

## 构建

```bash
pnpm run build
```

构建产物默认位于 `website/doc_build/`。

## 部署

仓库中的 `.github/workflows/deploy-website.yml` 会在推送到 `main` 时构建本站，并部署到 GitHub Pages。

由于这是 GitHub 项目页，Rspress 配置中设置了：

```ts
base: '/ocean-course-design/'
```
