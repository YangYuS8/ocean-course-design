---
title: API 和 JSON 是什么
description: 用本项目接口解释 API、HTTP 方法、JSON 请求和响应。
---

# API 和 JSON 是什么

## API 是什么？

API 可以理解成“前端和后端约定好的办事窗口”。

比如前端想拿任务列表，就访问：

```text
GET /api/tasks
```

前端想新建任务，就访问：

```text
POST /api/tasks
```

## GET 和 POST 有什么区别？

先记最简单的：

| 方法 | 简单理解 | 本项目例子 |
| --- | --- | --- |
| GET | 查询数据 | 查看任务列表 |
| POST | 新增或执行动作 | 新建任务、开始任务、生成分析 |
| PUT | 修改数据 | 修改用户 |
| DELETE | 删除数据 | 删除用户 |

## JSON 是什么？

JSON 是前后端传数据的格式，看起来像这样：

```json
{
  "title": "港口近岸水质巡检",
  "area": "北部港口海域",
  "inspector": "张海宁"
}
```

前端提交表单后，会把数据整理成 JSON 发给 PHP 后端。

后端处理完，也会把结果用 JSON 返回给前端。

## 本项目中 api.ts 做什么？

文件：

```text
frontend/src/api.ts
```

它统一负责：

- 拼接后端地址。
- 设置 JSON 请求头。
- 登录后自动带 token。
- 处理接口错误。
- 把后端 JSON 转成前端对象。

## 必背说法

> API 是前端和后端通信的接口，JSON 是它们传数据时使用的格式。本项目所有业务数据都通过 `/api/*` 接口传递。
