---
title: Laravel 文件地图
description: 用本项目 backend 目录解释 Laravel 文件分别干什么。
---

# Laravel 文件地图

Laravel 项目文件很多，第一次看会晕。先记住：不是所有文件都要讲。

## 最重要的几个目录

```text
backend/
├── routes/api.php              # 接口入口
├── app/Http/Controllers/       # 控制器，处理业务请求
├── app/Http/Middleware/        # 中间件，进入控制器前先检查
├── app/Models/                 # 模型，对应数据库表
├── database/migrations/        # 建表文件
├── database/seeders/           # 初始数据
└── tests/Feature/              # 接口测试
```

## 用餐厅比喻理解 Laravel

| Laravel 部分 | 餐厅比喻 | 项目中做什么 |
| --- | --- | --- |
| Route 路由 | 前台接待 | 看请求要交给谁处理 |
| Middleware 中间件 | 门卫 | 检查有没有登录 token |
| Controller 控制器 | 服务员/厨师长 | 处理具体业务 |
| Model 模型 | 仓库管理员 | 读写数据库 |
| Migration 迁移 | 仓库设计图 | 定义数据库表结构 |
| Seeder | 预置食材 | 准备初始数据 |
| Test 测试 | 检查员 | 验证流程能不能跑通 |

## 本项目一条请求怎么走？

以前端查看任务列表为例：

```text
前端 GET /api/tasks
  -> routes/api.php 找到 TaskController@index
  -> RequireApiToken 检查是否登录
  -> TaskController 查询任务
  -> InspectionTask 模型读取 inspection_tasks 表
  -> 返回 JSON 给前端
```

## 哪些不用深入讲？

- `vendor/`：第三方依赖。
- `storage/`：缓存和日志。
- 大部分 `config/`：框架配置。
- `public/index.php`：入口文件，知道有它即可。

## 必背说法

> Laravel 用固定目录把后端代码分层：路由负责分发请求，控制器负责业务逻辑，模型负责数据库，迁移负责建表，Seeder 负责初始数据。
