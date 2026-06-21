---
title: SQLite 是什么
description: 解释为什么课程项目使用 SQLite，以及它和 MySQL 的关系。
---

# SQLite 是什么

SQLite 是一种轻量级数据库。

## 它和 MySQL 有什么区别？

简单理解：

| 数据库 | 简单理解 |
| --- | --- |
| SQLite | 一个文件就是一个数据库，适合本地演示 |
| MySQL | 需要单独安装服务，适合正式服务器 |

本项目用 SQLite，是为了让大家更容易运行，不用配置复杂数据库服务。

## 本项目数据库文件在哪里？

```text
backend/database/database.sqlite
```

这个文件保存本地数据。

## Laravel 会不会只能用 SQLite？

不会。

Laravel 通过配置连接数据库。以后如果改成 MySQL，主要改 `.env` 和数据库配置，Model 和 Controller 大部分不用重写。

## 为什么课程项目适合 SQLite？

因为：

- 不用额外安装数据库服务。
- 一个文件就能跑。
- 方便答辩演示。
- 适合小型课程设计。

## 必背说法

> SQLite 是轻量数据库，适合本地课程演示；Laravel 的迁移和模型让项目以后也可以比较方便地换成 MySQL。
