# 分工 3：PHP 单表结构、基础模型与种子数据讲解（基础薄弱组员 A）

## 负责定位

这一部分是 PHP 后端中相对容易、风险较低的部分。你不需要讲复杂业务逻辑，也不需要解释所有 Laravel 架构，只需要把“数据库表、字段、简单模型关系、初始数据”讲清楚。

如果老师追问到整体架构、异常判断、登录中间件等难点，可以交给杨栋森或核心业务控制器负责人补充。

## 负责文件

重点负责以下文件中的基础内容：

- `backend/database/migrations/2026_06_11_000001_create_ocean_demo_tables.php`
- `backend/database/migrations/0001_01_01_000000_create_users_table.php`
- `backend/app/Models/InspectionTask.php`
- `backend/app/Models/Sample.php`
- `backend/database/seeders/DatabaseSeeder.php`

了解但不主讲：

- `SampleResult.php`
- `SampleException.php`
- `AnalysisJob.php`

这些如果被深问，由杨栋森或核心业务组员补充。

## 你主要讲什么

### 1. migration 是什么

背这个说法：

> Migration 是 Laravel 用 PHP 代码创建数据库表的方式。执行 `php artisan migrate:fresh --seed` 后，Laravel 会按照迁移文件重新创建表，并用 Seeder 填充初始数据。

### 2. 你重点讲三张表

#### inspection_tasks 巡检任务表

作用：保存一次巡检任务。

重点字段：

- `title`：任务名称。
- `area`：巡检区域。
- `inspector`：负责人。
- `planned_date`：计划日期。
- `status`：任务状态。

#### samples 样本表

作用：保存一次现场采样记录。

重点字段：

- `inspection_task_id`：所属任务。
- `code`：样本编号。
- `location`：采样点位。
- `collector`：采样人。
- `collected_at`：采样时间。

#### users 用户表

作用：保存系统用户。

重点字段：

- `name`：姓名。
- `email`：登录邮箱。
- `password`：加密后的密码。
- `role`：用户角色。

### 3. 表关系只讲最简单的一句

记住：

```text
一个巡检任务可以有多个样本，一个样本属于一个巡检任务。
```

对应代码：

```php
// InspectionTask.php
public function samples(): HasMany

// Sample.php
public function task(): BelongsTo
```

### 4. Seeder 初始数据

文件：

```text
backend/database/seeders/DatabaseSeeder.php
```

背这个说法：

> Seeder 用来生成初始数据。项目运行前执行 `php artisan migrate:fresh --seed`，就会自动生成管理员账号、巡检任务、样本、检测结果和异常记录，方便演示。

## 必背命令

```bash
cd backend
php artisan migrate:fresh --seed
```

解释：

- `migrate:fresh`：删掉旧表，重新建表。
- `--seed`：填充初始数据。

## 你不要主动展开的内容

为了避免被追问太深，下面这些不要主动讲：

- token 中间件如何校验。
- 检测结果如何自动生成异常。
- AnalysisController 如何生成建议。
- 前端怎么调用接口。
- 完整 Laravel 生命周期。

如果老师问到，可以这样转接：

> 我主要负责数据库表和基础模型关系，这个问题涉及后端接口/业务逻辑，可以由负责核心业务控制器的同学补充。

## 常见答辩问题

### 为什么样本表要有 inspection_task_id？

答：

> 因为样本必须属于某一次巡检任务，否则不知道这个样本是哪次巡检采集的。

### 为什么样本编号 code 要唯一？

答：

> 样本编号用于区分不同采样记录，如果重复，会导致检测结果和异常记录混乱。

### Model 是什么？

答：

> Model 是 Laravel 中对应数据库表的 PHP 类，例如 `Sample` 模型对应 `samples` 表。

### 你的 PHP 部分是什么？

答：

> 我负责 PHP 数据库迁移、基础模型关系和 Seeder 初始数据，主要说明系统数据是怎么存储和初始化的。
