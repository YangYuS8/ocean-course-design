# 分工 1：PHP 总体架构、接口入口、数据库设计统筹与前端集成（负责人：杨栋森）

## 负责定位

这一部分由杨栋森负责，是全组的主讲和兜底部分，不是最轻松的部分。因为 PHP 老师答辩时很可能重点追问后端，所以你需要承担“后端总体设计解释”和“关键链路兜底”。

你的定位是：

```text
项目总负责人 + PHP 后端总体架构负责人 + 前后端集成负责人
```

也就是说，你不只是讲前端，而是负责把 PHP 后端的整体结构、路由入口、中间件、数据库关系、业务闭环全部串起来。

## 负责范围

### 1. PHP 后端总体架构

你负责讲清楚 Laravel 后端整体结构：

```text
routes/api.php
    ↓
RequireApiToken 中间件
    ↓
Controller 控制器
    ↓
Model 模型
    ↓
SQLite 数据库
```

重点文件：

- `backend/README.md`
- `backend/routes/api.php`
- `backend/bootstrap/app.php`
- `backend/app/Http/Middleware/RequireApiToken.php`
- `backend/database/migrations/2026_06_11_000001_create_ocean_demo_tables.php`
- `backend/app/Models/*.php`

你不需要逐行讲所有 Controller，但要能解释它们在整体架构中的位置。

### 2. API 路由与登录中间件

你负责解释：

- 前端请求为什么都走 `/api/*`。
- `routes/api.php` 如何把 URL 分发给 Controller。
- 为什么 `/api/login` 公开，其他业务接口需要登录。
- `auth.simple` 中间件如何保护业务接口。
- 未登录访问 `/api/dashboard` 为什么会返回 401。

重点讲法：

> Laravel 路由负责把前端 URL 请求交给对应控制器。为了避免业务接口裸露，我们把除登录外的接口都放进 `auth.simple` 中间件分组，只有携带合法 token 的请求才能访问。

### 3. 数据库设计统筹

虽然数据库细节由基础薄弱组员 A 讲，但你要负责兜底解释数据库整体设计。

你需要掌握这张关系：

```text
InspectionTask 1 -- N Sample
Sample 1 -- N SampleResult
Sample 1 -- N SampleException
Sample 1 -- N AnalysisJob
```

你要能回答：

- 为什么样本必须关联巡检任务？
- 为什么检测结果属于样本？
- 为什么异常和分析建议也挂在样本下面？
- 为什么使用 SQLite？
- migration、model、seeder 分别是什么？

### 4. 前端集成

你仍然负责前端部分，但答辩时不要让自己显得只做前端。前端只作为“如何调用 PHP 后端”的证明。

重点文件：

- `frontend/src/App.tsx`
- `frontend/src/api.ts`
- `frontend/src/hooks/useOceanData.ts`
- `frontend/src/pages/*.tsx`

讲法：

> 前端页面本身不是重点，重点是页面表单会通过 `api.ts` 调用 PHP 后端接口，后端校验后写入 SQLite，再把 JSON 返回前端刷新页面。

## 你应该主动讲的 PHP 内容

### 1. Laravel 后端不是随便写 PHP 文件

可以这样说：

> Laravel 项目有固定结构：路由在 `routes/api.php`，业务处理在 Controller，数据库表对应 Model，建表用 migration，初始数据用 seeder。我们按照 Laravel 的 MVC 思路组织后端代码。

### 2. 为什么业务接口要登录保护

可以这样说：

> 如果只在前端限制登录，别人仍然可以直接访问后端接口，所以我们在 PHP 后端加了 token 中间件。这样登录不是页面装饰，而是后端接口真实校验。

### 3. 为什么检测异常由后端判断

这部分如果强组员没讲清楚，你要兜底：

> 检测值是否异常不能只靠前端判断，因为前端可以被修改。后端根据 `standard_min` 和 `standard_max` 统一判断，并自动生成异常记录，这样数据更可信。

### 4. 为什么要写测试

可以这样说：

> 后端 Feature Test 模拟真实 HTTP 请求，从登录、创建任务、登记样本、录入结果、自动异常、处理异常到首页统计都验证了一遍，说明项目不是静态页面。

## 业务演示主线

你负责最终串联演示：

1. 登录系统，说明后端 token 校验。
2. 打开首页，说明统计数据来自 PHP 后端。
3. 创建巡检任务，说明请求进入 `TaskController`。
4. 登记样本，说明样本关联任务。
5. 录入超标检测结果，说明后端自动判断异常。
6. 查看异常列表，说明异常记录由后端生成。
7. 处理异常，说明状态和处理说明写入数据库。
8. 生成分析建议，说明规则分析逻辑。
9. 返回首页，说明统计数据实时变化。

## 你要兜底的追问

如果两个基础薄弱组员被问到下面问题答不上来，你负责接住：

- migration 和 model 的区别是什么？
- 外键为什么这样设计？
- 为什么登录要在后端校验？
- 为什么异常判断放在后端？
- 前端页面的数据从哪里来？
- 如何证明不是静态页面？
- Laravel 项目结构中哪些是框架生成的，哪些是你们写的？

## 常见答辩问题

### 你的 PHP 部分到底是什么？

答：

> 我负责 PHP 后端总体架构、API 路由入口、登录中间件、数据库关系设计统筹，以及前后端接口集成。具体业务控制器由另一位组员负责，我负责整体串联和关键问题兜底。

### 你为什么还负责前端？

答：

> 因为这是前后端分离项目，我负责把前端页面操作和 PHP 后端接口打通。前端不是孤立页面，而是用来验证 PHP 后端 API 和数据库流程是否真正可用。

### 如果老师问项目最核心的 PHP 设计是什么？

答：

> 核心是 Laravel 的路由、控制器、模型、迁移和中间件组合：路由接收 API，请求先经过 token 中间件，再进入控制器，控制器用模型操作 SQLite，最后返回 JSON 给前端。
