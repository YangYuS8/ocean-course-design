# 分工 2：PHP 核心业务控制器与异常分析逻辑（基础较强组员）

## 负责定位

这一部分是全组另一个较难的 PHP 部分，建议分给除杨宇外基础最好的组员。它负责解释系统核心业务逻辑：任务、样本、检测结果、异常处理、分析建议。

这部分会被老师重点追问，因为它最能体现 PHP 后端是否真正实现了业务流程。

## 负责文件

- `backend/app/Http/Controllers/TaskController.php`
- `backend/app/Http/Controllers/SampleController.php`
- `backend/app/Http/Controllers/ResultController.php`
- `backend/app/Http/Controllers/ExceptionController.php`
- `backend/app/Http/Controllers/AnalysisController.php`
- `backend/app/Http/Controllers/DashboardController.php`

## 核心业务链

```text
巡检任务 -> 样本登记 -> 检测结果 -> 自动异常 -> 异常处理 -> 分析建议 -> 首页统计
```

## 每个控制器怎么讲

### 1. TaskController：巡检任务

负责：

- 查询任务列表。
- 创建任务。
- 开始任务。
- 提交任务。

关键知识点：

- `$request->validate()` 表单校验。
- `InspectionTask::create($data)` 写入数据库。
- `$task->update([...])` 修改状态。
- `response()->json()` 返回 JSON 数据。

答辩讲法：

> 任务是整个业务流程的起点。创建任务后，样本必须关联到某个任务，这样才能形成完整巡检记录。

### 2. SampleController：样本登记

负责：

- 查询样本列表。
- 登记样本。
- 查看样本详情。

关键知识点：

- `exists:inspection_tasks,id` 保证样本关联的任务真实存在。
- `unique:samples,code` 保证样本编号不重复。
- `with()` 预加载关联任务，减少查询次数。

答辩讲法：

> 样本是任务下面的具体采集记录，每个样本都有编号、点位、采样人和采样时间。

### 3. ResultController：检测结果与自动异常

负责：

- 查询检测结果。
- 给样本录入检测指标。
- 判断检测值是否异常。
- 异常时自动生成异常记录。

关键逻辑：

```php
if ($min !== null && $value < $min) return true;
if ($max !== null && $value > $max) return true;
```

答辩讲法：

> 检测结果录入后，后端根据参考上限和下限判断是否异常。异常判断放在后端，是为了保证业务规则可靠，不能只依赖前端。

### 4. ExceptionController：异常处理

负责：

- 查询异常列表。
- 手动上报异常。
- 处理异常并记录处理说明。

关键知识点：

- 异常状态从“待处理”变为“已处理”。
- `resolution` 字段保存处理说明。
- 同步更新样本状态。

答辩讲法：

> 异常处理不是简单删除记录，而是保留异常原因和处理结果，方便后续追踪。

### 5. AnalysisController：分析建议

负责：

- 统计样本下的检测结果数量。
- 统计异常指标数量。
- 统计待处理异常数量。
- 根据统计结果生成建议和报告摘要。

答辩讲法：

> 分析功能没有使用复杂算法，而是用课程范围内容易理解的条件判断和统计规则生成建议，同时生成一段报告摘要，用于样本详情页展示。

### 6. DashboardController：首页统计

负责：

- 统计任务总数。
- 统计样本总数。
- 统计检测结果总数。
- 统计待处理异常。
- 返回异常检测结果、近期异常、近期分析建议。

答辩讲法：

> 首页不是写死数据，而是实时查询数据库统计结果，所以业务操作后首页数据会变化。

## 需要掌握的 PHP/Laravel 知识点

1. Controller 控制器。
2. Request 参数校验。
3. Eloquent 增删改查。
4. 一对多关联查询。
5. JSON API 返回。
6. 条件判断生成业务结果。
7. HTTP 状态码：201 创建成功，401 未登录，422 参数错误。

## 常见答辩问题

### 为什么异常判断放在后端？

因为后端是可信的业务层。前端可能被修改，如果只靠前端判断，数据不可靠。

### 检测异常后系统会做什么？

会把样本状态改为“发现异常”，并自动生成一条待处理异常记录。

### 分析建议是不是 AI？

不是。这里是课程项目中更容易解释的规则分析，通过异常数量和处理状态生成建议，并把样本编号、采样点、采样人、天气、坐标和异常数量整理成报告摘要。

### 你的 PHP 部分是什么？

我负责 PHP 后端核心业务控制器，包括任务、样本、检测结果、异常处理和分析建议。
