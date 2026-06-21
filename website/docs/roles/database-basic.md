---
title: 基础薄弱组员 A：数据库表和基础模型
description: 给负责数据库基础部分的组员准备的低风险学习页。
---

# 基础薄弱组员 A：数据库表和基础模型

你负责的是比较容易背、比较容易讲清楚的部分。不要主动讲复杂业务逻辑。

## 你重点负责的文件

```text
backend/database/migrations/2026_06_11_000001_create_ocean_demo_tables.php
backend/database/migrations/0001_01_01_000000_create_users_table.php
backend/app/Models/InspectionTask.php
backend/app/Models/Sample.php
backend/database/seeders/DatabaseSeeder.php
```

## 你重点讲三件事

### 1. 有哪些表

你重点讲：

- `users`：用户表。
- `inspection_tasks`：巡检任务表。
- `samples`：样本表。

如果老师问其他表，也可以说：

- `sample_results`：检测结果。
- `exceptions`：异常记录。
- `analysis_jobs`：分析建议。

### 2. 任务和样本的关系

必背：

> 一个巡检任务可以有多个样本，一个样本属于一个巡检任务。

这就是一对多关系。

### 3. Seeder 是什么

必背：

> Seeder 用来生成初始数据。执行 `php artisan migrate:fresh --seed` 后，系统会自动生成管理员账号、任务、样本和检测结果，方便演示。

## 你不要主动讲什么

不要主动讲：

- token 怎么校验。
- 检测异常怎么自动生成。
- 控制器完整流程。
- 前端 React。

如果老师问，你可以说：

> 我主要负责数据库表和基础模型，这个问题涉及业务控制器，可以由负责控制器的同学补充。

## 你的必背说法

> 我负责数据库表结构、基础模型和初始数据。数据库中任务表保存巡检任务，样本表保存采样记录，样本通过 `inspection_task_id` 关联到任务。Seeder 用来生成演示数据。

## 三个常见问题

### 问：为什么样本要关联任务？

答：

> 因为样本必须属于某一次巡检，不然不知道它是哪次任务采集的。

### 问：样本编号为什么不能重复？

答：

> 样本编号用来区分采样记录，重复会导致检测结果归属混乱。

### 问：Model 是什么？

答：

> Model 是数据库表在 PHP 代码里的代表，比如 `Sample` 模型对应 `samples` 表。
