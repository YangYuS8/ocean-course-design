---
title: 路由、控制器、模型是什么
description: 解释 Laravel 中 Route、Controller、Model 如何配合完成一次接口请求。
---

# 路由、控制器、模型是什么

这是 Laravel 后端最重要的三件套。

```text
Route -> Controller -> Model -> Database
```

## Route 路由：决定请求交给谁

文件：

```text
backend/routes/api.php
```

例子：

```php
Route::get('/tasks', [TaskController::class, 'index']);
```

大白话：

> 如果前端访问 `/api/tasks`，就让 `TaskController` 的 `index()` 方法处理。

## Controller 控制器：真正处理业务

文件例子：

```text
backend/app/Http/Controllers/TaskController.php
```

控制器负责：

1. 接收请求。
2. 校验数据。
3. 调用 Model 读写数据库。
4. 返回 JSON。

比如新建任务：

```php
$data = $request->validate([...]);
$task = InspectionTask::create($data);
return response()->json($task, 201);
```

## Model 模型：代表数据库表

文件例子：

```text
backend/app/Models/InspectionTask.php
```

大白话：

> Model 是 PHP 里代表数据库表的类。你操作 Model，就相当于操作数据库表。

例如：

```php
InspectionTask::create($data);
```

意思是往 `inspection_tasks` 表新增一条任务。

## 本项目里的对应关系

| 路由/控制器 | 模型 | 数据表 |
| --- | --- | --- |
| TaskController | InspectionTask | inspection_tasks |
| SampleController | Sample | samples |
| ResultController | SampleResult | sample_results |
| ExceptionController | SampleException | exceptions |
| AnalysisController | AnalysisJob | analysis_jobs |

## 必背说法

> 路由负责找到哪个控制器处理请求，控制器负责业务逻辑，模型负责和数据库表打交道。
