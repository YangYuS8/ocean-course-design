---
title: 学习路线：零基础怎么补
description: 按共通基础、PHP/Laravel、数据库和个人分工安排学习顺序。
---

# 学习路线：零基础怎么补

如果你基础不强，不要从代码第一行开始看。先按下面顺序补。

## 第一步：先懂网页怎么和后端说话

先看：

- [网页、后端、数据库怎么配合](../common/how-web-works.mdx)
- [API 和 JSON 是什么](../common/api-json.md)

目标：知道前端按钮不是魔法，它会发请求给 PHP 后端。

## 第二步：再懂 Laravel 项目结构

先看：

- [PHP 语法够用版](../php-laravel/php-syntax.md)
- [Laravel 文件地图](../php-laravel/laravel-map.md)
- [路由、控制器、模型是什么](../php-laravel/route-controller-model.md)

目标：看到 `routes/api.php`、`Controller`、`Model` 不害怕。

## 第三步：补数据库

先看：

- [项目有哪些表](../database/tables.md)
- [表之间是什么关系](../database/relationships.mdx)
- [migration、model、seeder 是什么](../database/migration-model-seeder.md)

目标：能解释数据存在哪里，表为什么这样设计。

## 第四步：看自己的分工

- 负责总体架构：看 [杨栋森分工](../roles/lead.mdx)
- 负责控制器：看 [核心控制器分工](../roles/core-controller.md)
- 负责数据库：看 [数据库基础分工](../roles/database-basic.md)
- 负责登录测试：看 [登录测试分工](../roles/auth-test.md)

## 第五步：跑起来

最后看：

- [本地运行和常见问题](../defense/local-run.md)
- [老师可能怎么问](../defense/faq.md)

目标：能现场演示，不怕项目起不来。
