---
title: 第一次看代码该看哪里
description: 告诉零基础组员如何按顺序阅读本项目代码。
---

# 第一次看代码该看哪里

不要一打开项目就乱点文件。按顺序看。

## 先看 README

根目录：

```text
README.md
```

它告诉你项目做什么、怎么运行、有什么功能。

后端：

```text
backend/README.md
```

它告诉你 Laravel 目录里哪些文件是项目重点。

前端：

```text
frontend/README.md
```

它告诉你 React 前端从哪里启动、页面怎么组织。

## 后端代码阅读顺序

```text
routes/api.php
↓
app/Http/Controllers/
↓
app/Models/
↓
database/migrations/
↓
database/seeders/
↓
tests/Feature/
```

## 前端代码阅读顺序

```text
src/main.tsx
↓
src/App.tsx
↓
src/api.ts
↓
src/hooks/useOceanData.ts
↓
src/pages/
```

## 看不懂类名怎么办？

先按英文猜意思：

| 名字 | 大概意思 |
| --- | --- |
| Task | 任务 |
| Sample | 样本 |
| Result | 检测结果 |
| Exception | 异常 |
| Analysis | 分析 |
| Controller | 控制器 |
| Model | 模型 |

## 不要钻牛角尖

答辩不是让你解释 Laravel 源码。你只需要讲清楚：

- 这个文件在项目里干什么。
- 它和业务流程有什么关系。
- 它怎么和其他文件配合。
