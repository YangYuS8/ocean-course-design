---
title: 表单校验是什么
description: 用本项目的任务、样本和检测结果表单解释 Laravel validate 的作用。
---

# 表单校验是什么

用户填表不一定可靠，所以后端必须检查。

## 为什么要校验？

如果不校验，可能出现：

- 任务名称为空。
- 样本编号重复。
- 检测值不是数字。
- 样本关联了不存在的任务。

这些都会让数据库变乱。

## Laravel 怎么校验？

控制器里常见：

```php
$data = $request->validate([
    'title' => ['required', 'string', 'max:120'],
    'area' => ['required', 'string', 'max:120'],
]);
```

简单理解：

> 后端先检查前端传来的字段，合格才继续写数据库。不合格就返回错误。

## 常见规则解释

| 规则 | 简单理解 |
| --- | --- |
| required | 必填 |
| string | 必须是字符串 |
| numeric | 必须是数字 |
| date | 必须是日期 |
| max:120 | 最多 120 个字符 |
| unique:samples,code | 样本编号不能重复 |
| exists:inspection_tasks,id | 任务 id 必须真的存在 |

## 本项目例子

样本登记要求：

```php
'inspection_task_id' => ['required', 'exists:inspection_tasks,id'],
'code' => ['required', 'string', 'max:60', 'unique:samples,code'],
```

意思是：

- 样本必须属于一个真实存在的任务。
- 样本编号不能和已有编号重复。

## 必背说法

> 表单校验是后端保护数据库质量的第一关。前端传来的数据必须通过 Laravel validate，才能写入数据库。
