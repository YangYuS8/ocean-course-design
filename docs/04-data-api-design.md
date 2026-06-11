# 数据与 API 设计

## 数据表设计

### users

用于保存简单用户信息。课程设计版本不实现完整权限系统。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | integer | 主键 |
| name | string | 用户姓名 |
| email | string | 邮箱 |
| password | string | 密码哈希 |
| created_at / updated_at | datetime | 创建和更新时间 |

### inspection_tasks

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | integer | 主键 |
| title | string | 任务名称 |
| area | string | 巡检区域 |
| inspector_name | string | 负责人 |
| planned_date | date | 计划巡检日期 |
| status | string | pending / in_progress / submitted |
| description | text | 任务说明 |
| created_at / updated_at | datetime | 创建和更新时间 |

### samples

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | integer | 主键 |
| inspection_task_id | integer | 所属巡检任务 ID |
| sample_code | string | 样本编号 |
| location | string | 采样点 |
| sampled_at | datetime | 采样时间 |
| note | text | 备注 |
| created_at / updated_at | datetime | 创建和更新时间 |

### sample_results

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | integer | 主键 |
| sample_id | integer | 所属样本 ID |
| ph | decimal | pH 值 |
| salinity | decimal | 盐度 |
| temperature | decimal | 温度 |
| dissolved_oxygen | decimal | 溶解氧 |
| turbidity | decimal | 浊度 |
| is_abnormal | boolean | 是否异常 |
| created_at / updated_at | datetime | 创建和更新时间 |

### exceptions

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | integer | 主键 |
| sample_id | integer | 关联样本 ID |
| sample_result_id | integer | 关联检测结果 ID，可为空 |
| level | string | low / medium / high |
| indicator | string | 异常指标，例如 pH、溶解氧 |
| description | text | 异常说明 |
| status | string | open / resolved |
| resolution | text | 处理说明 |
| resolved_at | datetime | 处理时间 |
| created_at / updated_at | datetime | 创建和更新时间 |

### analysis_jobs

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | integer | 主键 |
| sample_id | integer | 关联样本 ID |
| summary | text | 分析摘要 |
| suggestion | text | 建议内容 |
| status | string | completed / failed |
| created_at / updated_at | datetime | 创建和更新时间 |

## 表关系

```text
inspection_tasks 1 --- N samples
samples 1 --- N sample_results
samples 1 --- N exceptions
sample_results 1 --- N exceptions
samples 1 --- N analysis_jobs
```

## API 设计

### 首页统计

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/dashboard` | 获取任务、样本、异常、分析建议统计 |

### 巡检任务

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/tasks` | 获取任务列表 |
| POST | `/api/tasks` | 创建任务 |
| POST | `/api/tasks/{id}/start` | 开始任务 |
| POST | `/api/tasks/{id}/submit` | 提交任务 |

创建任务请求示例：

```json
{
  "title": "近岸海域水质巡检",
  "area": "A1 近岸监测区",
  "inspector_name": "张三",
  "planned_date": "2026-06-12",
  "description": "对近岸海域进行常规水质巡检"
}
```

### 样本

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/samples` | 获取样本列表 |
| POST | `/api/samples` | 登记样本 |
| GET | `/api/samples/{id}` | 查看样本详情 |
| POST | `/api/samples/{id}/results` | 为样本录入检测结果 |

登记样本请求示例：

```json
{
  "inspection_task_id": 1,
  "sample_code": "S-20260612-001",
  "location": "A1-东侧采样点",
  "sampled_at": "2026-06-12 09:30:00",
  "note": "天气晴，海面平稳"
}
```

录入检测结果请求示例：

```json
{
  "ph": 8.9,
  "salinity": 32.5,
  "temperature": 24.3,
  "dissolved_oxygen": 4.6,
  "turbidity": 18.2
}
```

### 检测结果

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/results` | 获取检测结果列表 |

### 异常

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/exceptions` | 获取异常列表 |
| POST | `/api/exceptions` | 手动上报异常 |
| POST | `/api/exceptions/{id}/resolve` | 处理异常 |

处理异常请求示例：

```json
{
  "resolution": "已安排复检，并通知负责人关注溶解氧偏低问题。"
}
```

### 分析建议

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/samples/{id}/analyze` | 对样本生成分析建议 |

分析响应示例：

```json
{
  "id": 1,
  "sample_id": 1,
  "summary": "样本存在 pH 偏高和溶解氧偏低情况。",
  "suggestion": "建议 24 小时内复检，并增加周边采样点。",
  "status": "completed"
}
```

## 统一响应建议

课程设计版本可以直接返回资源对象或数组。为了便于前端处理，也可以使用统一格式：

```json
{
  "data": {},
  "message": "操作成功"
}
```

## 参数校验建议

- 必填字段不能为空，例如任务名称、采样点、样本编号。
- 检测指标应为数字。
- 状态值只能使用约定枚举。
- 处理异常时必须填写处理说明。
