---
title: migration、model、seeder 是什么
description: 用清楚的语言解释 Laravel 数据库相关的三个核心概念。
---

# migration、model、seeder 是什么

这三个词很常见，先记住核心理解。

## migration：建表图纸

目录：

```text
backend/database/migrations/
```

migration 负责定义数据库表长什么样。

比如：

- 表叫什么名字。
- 有哪些字段。
- 字段是字符串、数字还是日期。
- 有没有外键。

简单理解：

> migration 就是数据库表的设计图。

## model：表对应的 PHP 类

目录：

```text
backend/app/Models/
```

Model 负责让 PHP 更方便地操作数据库表。

例如：

```php
InspectionTask::create($data);
```

意思是往任务表新增一条数据。

简单理解：

> model 就是数据库表在 PHP 代码里的代表。

## seeder：初始数据生成器

文件：

```text
backend/database/seeders/DatabaseSeeder.php
```

Seeder 负责生成一批初始数据。

例如：

- 管理员账号。
- 示例任务。
- 示例样本。
- 示例检测结果。
- 示例异常。

简单理解：

> seeder 就是给系统准备演示数据的工具。

## 一条命令把它们串起来

```bash
php artisan migrate:fresh --seed
```

含义：

1. 删除旧表。
2. 根据 migration 重新建表。
3. 运行 seeder 填充初始数据。

## 必背说法

> migration 负责建表，model 负责用 PHP 操作表，seeder 负责生成初始数据。
