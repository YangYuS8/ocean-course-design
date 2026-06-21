---
title: 网页、PHP 后端、数据库怎么配合
description: 用大白话解释前端、后端、数据库在本项目里的分工。
---

# 网页、PHP 后端、数据库怎么配合

先把三个角色分清楚。

## 前端是什么？

前端就是你在浏览器里看到的页面。

在本项目里，前端代码在：

```text
frontend/
```

它负责：

- 显示按钮、表单、表格。
- 让用户填写任务、样本、检测结果。
- 把用户填写的数据发给后端。
- 把后端返回的数据展示出来。

## 后端是什么？

后端就是 PHP/Laravel 写的接口服务。

在本项目里，后端代码在：

```text
backend/
```

它负责：

- 接收前端请求。
- 检查数据是否合理。
- 判断检测结果是否异常。
- 读写数据库。
- 返回 JSON 给前端。

## 数据库是什么？

数据库就是保存数据的地方。

本项目用 SQLite，文件大概是：

```text
backend/database/database.sqlite
```

它保存：

- 用户。
- 巡检任务。
- 样本。
- 检测结果。
- 异常记录。
- 分析建议。

## 一次“新建任务”发生了什么？

```mermaid
sequenceDiagram
  participant U as 用户
  participant F as 前端页面
  participant B as PHP 后端
  participant D as SQLite 数据库

  U->>F: 填写任务表单
  F->>B: POST /api/tasks
  B->>B: 校验 title、area、inspector
  B->>D: 保存任务
  D-->>B: 返回新任务
  B-->>F: 返回 JSON
  F-->>U: 页面刷新任务列表
```

## 最重要的一句话

> 前端负责展示和提交，PHP 后端负责判断和保存，数据库负责长期存储。
