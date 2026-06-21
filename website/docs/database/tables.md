---
title: 项目有哪些数据库表
description: 用清楚的语言解释 users、inspection_tasks、samples、sample_results、exceptions、analysis_jobs 六张表。
---

# 项目有哪些数据库表

数据库表就是一张张 Excel 表，只不过它们存在数据库里。

本项目主要有六张表。

## 1. users 用户表

保存谁能登录系统。

常见字段：

- `name`：姓名。
- `email`：邮箱，也是登录账号。
- `password`：加密后的密码。
- `role`：角色，admin 或 user。
- `api_token_hash`：登录 token 的哈希值。

## 2. inspection_tasks 巡检任务表

保存一次巡检任务。

比如：“港口近岸水质巡检”。

常见字段：

- `title`：任务名称。
- `area`：巡检区域。
- `inspector`：负责人。
- `planned_date`：计划日期。
- `status`：任务状态。

## 3. samples 样本表

保存一次采样记录。

比如：“S-20260610-001，港口一号采样点”。

常见字段：

- `inspection_task_id`：属于哪个巡检任务。
- `code`：样本编号。
- `location`：采样点位。
- `collector`：采样人。
- `collected_at`：采样时间。
- `weather`：现场天气。
- `coordinate`：采样坐标。

## 4. sample_results 检测结果表

保存样本的检测指标。

比如：pH = 8.9。

常见字段：

- `sample_id`：属于哪个样本。
- `indicator`：检测指标。
- `value`：检测值。
- `standard_min`：参考下限。
- `standard_max`：参考上限。
- `is_abnormal`：是否异常。

## 5. exceptions 异常表

保存异常记录。

比如：“pH 指标异常”。

常见字段：

- `sample_id`：属于哪个样本。
- `title`：异常标题。
- `level`：异常等级。
- `status`：待处理或已处理。
- `resolution`：处理说明。

## 6. analysis_jobs 分析建议表

保存系统生成的分析建议。

常见字段：

- `sample_id`：属于哪个样本。
- `summary`：分析摘要。
- `suggestion`：处理建议。
- `report_summary`：样本详情页展示的报告摘要。

## 必背说法

> 本项目数据库围绕“任务和样本”设计。任务下面有样本，样本保存天气和坐标等现场信息；样本下面有检测结果、异常记录和分析建议，分析记录里还保存报告摘要。
