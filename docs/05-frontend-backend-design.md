# 前后端设计

## 前端设计

### 页面结构

前端建议采用「左侧导航 + 顶部标题 + 内容区」的后台布局。

| 页面 | 主要内容 |
| --- | --- |
| 首页统计 | 统计卡片、业务链说明、最近异常、最近分析建议 |
| 巡检任务 | 任务表格、创建任务表单、开始/提交按钮 |
| 样本管理 | 样本表格、样本登记表单、样本详情入口 |
| 检测结果 | 结果表格、指标展示、异常标记 |
| 异常与分析 | 异常列表、处理表单、分析建议展示 |
| 答辩说明 | 项目介绍、技术栈、演示步骤、分工说明 |

### UI 风格

- 默认中文标签。
- 使用海洋蓝、青绿色作为主色。
- 页面保持专业、简单，避免夸张动画。
- 表格用于展示业务数据，卡片用于统计数字。
- 表单字段尽量和数据库字段保持对应，方便答辩讲解。

### 前端数据请求

建议封装一个简单 API 工具，例如 `src/api/client.ts`，统一处理基础地址和 JSON 请求。

示例思路：

```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'
```

开发环境可以在 `.env` 中配置：

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## 后端设计

### Laravel 分层

课程设计版本建议保持 Laravel 默认结构，不额外引入复杂 Service 层。

| 层 | 职责 |
| --- | --- |
| routes/api.php | 定义 API 路由 |
| Controller | 接收请求、校验参数、返回 JSON |
| Model | 表示数据库实体和关系 |
| Migration | 定义表结构 |
| Seeder | 生成演示数据 |

### 推荐 Controller

| Controller | 职责 |
| --- | --- |
| DashboardController | 首页统计接口 |
| InspectionTaskController | 任务列表、创建、开始、提交 |
| SampleController | 样本列表、登记、修改、删除、详情 |
| SampleResultController | 检测结果列表、录入、修改、删除 |
| ExceptionController | 异常列表、上报、处理 |
| AnalysisController | 样本分析建议生成 |

### 推荐 Model

| Model | 对应表 |
| --- | --- |
| User | users |
| InspectionTask | inspection_tasks |
| Sample | samples |
| SampleResult | sample_results |
| ExceptionRecord | exceptions |
| AnalysisJob | analysis_jobs |

说明：`Exception` 是 PHP 语言中的常见异常类名，模型命名建议使用 `ExceptionRecord`，避免混淆。

## 前后端交互流程

```text
用户点击按钮
  -> React 调用 API
  -> Laravel Controller 校验参数
  -> Eloquent 读写 SQLite
  -> Laravel 返回 JSON
  -> React 更新页面状态
```

## 错误处理建议

课程设计版本不用做复杂错误系统，只需要覆盖常见情况：

- 表单必填项为空：前端提示「请填写任务名称」。
- API 返回 422：展示后端校验错误。
- API 返回 404：提示「数据不存在或已被删除」。
- 网络失败：提示「服务未启动，请检查后端地址」。

## 开发顺序建议

1. 后端先完成迁移、模型、种子数据。
2. 后端完成 API 并用浏览器或接口工具验证 JSON。
3. 前端完成布局和页面路由。
4. 前端逐个页面接入 API。
5. 使用演示脚本完整走一遍业务流程。

## 答辩讲法

可以这样解释前后端分工：

「前端负责用户能看到和操作的页面，例如任务列表、样本表单、异常处理按钮；后端负责业务数据的保存和规则判断，例如任务状态变化、检测结果保存、异常生成和分析建议。两端通过 JSON API 通信，数据库使用 SQLite 方便本地演示。」
