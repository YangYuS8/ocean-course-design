# 数据与 API 设计

## 数据表设计

### users

用于保存登录用户和简单角色信息。课程设计版本不实现完整 RBAC。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | integer | 主键 |
| name | string | 用户姓名 |
| email | string | 邮箱 |
| password | string | 密码哈希 |
| role | string | admin 或 user |
| api_token_hash | string | 登录 token 哈希 |
| created_at / updated_at | datetime | 创建和更新时间 |

### inspection_tasks

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | integer | 主键 |
| title | string | 任务名称 |
| area | string | 巡检区域 |
| inspector | string | 负责人 |
| planned_date | date | 计划巡检日期 |
| status | string | 待开始 / 进行中 / 已提交 |
| description | text | 任务说明 |
| started_at / submitted_at | datetime | 开始和提交时间 |
| created_at / updated_at | datetime | 创建和更新时间 |

### samples

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | integer | 主键 |
| inspection_task_id | integer | 所属巡检任务 ID |
| code | string | 样本编号 |
| location | string | 采样点位 |
| collected_at | datetime | 采样时间 |
| collector | string | 采样人 |
| water_type | string | 水体类型 |
| weather | string | 现场天气，保留原版环境参数的轻量表达 |
| coordinate | string | 采样坐标，保留原版定位采样的轻量表达 |
| status | string | 已登记 / 已检测 / 发现异常等 |
| notes | text | 现场备注 |
| created_at / updated_at | datetime | 创建和更新时间 |

### sample_results

本项目把检测指标设计成“每行一项指标”，比固定 ph/salinity 字段更灵活。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | integer | 主键 |
| sample_id | integer | 所属样本 ID |
| indicator | string | 指标名，例如 pH、溶解氧、氨氮 |
| value | decimal | 检测值 |
| unit | string | 单位 |
| standard_min | decimal | 参考下限，可为空 |
| standard_max | decimal | 参考上限，可为空 |
| is_abnormal | boolean | 是否异常，由后端计算 |
| tested_at | datetime | 检测时间 |
| tester | string | 检测人 |
| created_at / updated_at | datetime | 创建和更新时间 |

### exceptions

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | integer | 主键 |
| sample_id | integer | 关联样本 ID |
| title | string | 异常标题 |
| level | string | 低 / 中 / 高 |
| status | string | 待处理 / 已处理 |
| description | text | 异常说明 |
| resolution | text | 处理说明 |
| resolved_at | datetime | 处理时间 |
| created_at / updated_at | datetime | 创建和更新时间 |

### analysis_jobs

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | integer | 主键 |
| sample_id | integer | 关联样本 ID |
| status | string | 已完成 |
| summary | text | 分析摘要 |
| suggestion | text | 处理建议 |
| report_summary | text | 样本详情页展示的结构化报告摘要 |
| created_at / updated_at | datetime | 创建和更新时间 |

## 表关系

```text
inspection_tasks 1 --- N samples
samples 1 --- N sample_results
samples 1 --- N exceptions
samples 1 --- N analysis_jobs
```

## API 设计

### 登录与用户

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/login` | 登录并获取 token |
| GET | `/api/me` | 获取当前用户 |
| POST | `/api/logout` | 退出登录 |
| GET/POST/PUT/DELETE | `/api/users` | 简化用户管理 |

除 `/api/login` 外，业务接口都需要携带 token。

### 首页统计

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/dashboard` | 获取任务、样本、异常、分析建议统计，以及近期异常和近期分析 |

### 巡检任务

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/tasks` | 获取任务列表 |
| POST | `/api/tasks` | 创建任务 |
| POST | `/api/tasks/{id}/start` | 开始任务 |
| POST | `/api/tasks/{id}/submit` | 提交任务 |
| DELETE | `/api/tasks/{id}` | 删除任务 |

创建任务请求示例：

```json
{
  "title": "近岸海域水质巡检",
  "area": "A1 近岸监测区",
  "inspector": "张三",
  "planned_date": "2026-06-12",
  "description": "对近岸海域进行常规水质巡检"
}
```

### 样本

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/samples` | 获取样本列表 |
| POST | `/api/samples` | 登记样本 |
| GET | `/api/samples/{id}` | 查看样本详情，包含检测结果、异常记录和分析报告 |
| POST | `/api/samples/{id}/results` | 为样本录入检测结果 |

登记样本请求示例：

```json
{
  "inspection_task_id": 1,
  "code": "S-20260612-001",
  "location": "A1-东侧采样点",
  "collected_at": "2026-06-12 09:30:00",
  "collector": "李珊",
  "water_type": "近岸海水",
  "weather": "晴",
  "coordinate": "121.48,38.92",
  "notes": "海面平稳，水体略浑浊"
}
```

录入检测结果请求示例：

```json
{
  "indicator": "pH",
  "value": 8.9,
  "unit": "pH",
  "standard_min": 7.8,
  "standard_max": 8.5,
  "tested_at": "2026-06-12 10:15:00",
  "tester": "陈一鸣"
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
| POST | `/api/samples/{id}/analyze` | 对样本生成分析建议和报告摘要 |

分析响应示例：

```json
{
  "id": 1,
  "sample_id": 1,
  "status": "已完成",
  "summary": "样本 S-20260612-001 共录入 1 项检测结果，异常指标 1 项，待处理异常 1 条。",
  "suggestion": "样本存在待处理异常，建议先完成异常处置，再安排复测确认。",
  "report_summary": "样本 S-20260612-001｜采样点：A1-东侧采样点｜采样人：李珊｜天气：晴｜坐标：121.48,38.92｜检测项：1｜异常项：1｜待处理异常：1"
}
```

## 参数校验建议

- 必填字段不能为空，例如任务名称、样本编号、采样点、采样人、检测指标。
- 检测指标值应为数字。
- 处理异常时必须填写处理说明。
- 检测异常由后端根据 `standard_min` 和 `standard_max` 统一判断。
