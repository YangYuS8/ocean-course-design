---
title: 核心控制器负责人：任务、样本、检测、异常、分析
description: 给基础较强组员准备的核心 PHP 控制器学习路线。
---

# 核心控制器负责人：任务、样本、检测、异常、分析

你负责最硬的业务逻辑部分。老师问 PHP，很多问题会落到你这里。

## 你负责的文件

```text
backend/app/Http/Controllers/TaskController.php
backend/app/Http/Controllers/SampleController.php
backend/app/Http/Controllers/ResultController.php
backend/app/Http/Controllers/ExceptionController.php
backend/app/Http/Controllers/AnalysisController.php
backend/app/Http/Controllers/DashboardController.php
```

## 你要按业务链讲

```text
任务 -> 样本 -> 检测结果 -> 异常 -> 分析 -> 首页统计
```

## 每个控制器负责什么

### TaskController

处理巡检任务。

要会说：

> 创建任务时，后端校验任务名称、区域、负责人和计划日期，然后写入 `inspection_tasks` 表。

### SampleController

处理样本。

要会说：

> 样本必须关联一个真实存在的任务，所以后端用 `exists:inspection_tasks,id` 校验。

### ResultController

处理检测结果，这是重点。

要会说：

> 检测结果提交后，后端根据参考下限和上限判断是否异常。如果异常，会自动生成一条待处理异常记录。

核心判断：

```php
if ($min !== null && $value < $min) return true;
if ($max !== null && $value > $max) return true;
```

### ExceptionController

处理异常。

要会说：

> 异常不是删除掉，而是记录处理说明，把状态从待处理改成已处理。

### AnalysisController

生成分析建议。

要会说：

> 分析不是 AI，而是规则分析：统计异常指标和待处理异常数量，根据情况生成建议。

### DashboardController

首页统计。

要会说：

> 首页统计不是写死的，它会查询数据库里的任务、样本、结果、异常和分析记录数量。

## 你最容易被问的问题

### 为什么异常判断放后端？

答：

> 因为前端可以被修改，后端才是可信的业务层。异常判断放在 PHP 后端，可以保证数据规则一致。

### 为什么录入检测结果后会自动生成异常？

答：

> 这样业务链更完整。检测发现超标后，系统直接生成待处理异常，后续人员就能处理。

### 分析建议怎么来的？

答：

> 根据检测结果数量、异常指标数量和待处理异常数量，用 if 判断生成不同建议。

## 必背说法

> 我负责 PHP 核心业务控制器。控制器接收前端请求，先校验参数，再调用模型读写数据库，并根据业务规则判断异常、生成分析建议，最后返回 JSON 给前端。
