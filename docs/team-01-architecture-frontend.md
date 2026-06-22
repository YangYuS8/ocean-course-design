# 分工 1：PHP 后端总体架构、接口入口与用户管理（负责人：杨栋森）

## 负责定位

这一部分由杨栋森负责，是全组中偏难的 PHP 后端部分。因为答辩重点基本不会追问前端，所以你需要把精力放在“Laravel 后端总体结构、API 入口、登录保护和用户管理”上。

注意：老师已明确不允许你帮助其他组员答辩，所以你只讲自己负责的后端范围，不再承担全组兜底。其他组员需要把各自模块的基本问题背熟，你只在自己负责的架构、路由、登录保护、用户管理和前后端接口入口范围内作答。

你的定位是：

```text
项目统筹 + PHP 后端总体架构负责人 + API 入口与用户管理负责人
```

也就是说，你不再把前端作为主讲内容，而是负责把 PHP 后端的整体结构、路由入口、中间件、用户管理、数据库关系和业务闭环讲清楚。前端只作为“调用后端 API 的展示层”简单带过。

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

你不需要逐行讲所有业务 Controller，也不替其他组员解释它们的细节；但要能解释它们在整体架构中的位置。

### 2. API 路由与登录中间件

你负责解释：

- 前端请求为什么都走 `/api/*`。
- `routes/api.php` 如何把 URL 分发给 Controller。
- 为什么 `/api/login` 公开，其他业务接口需要登录。
- `auth.simple` 中间件如何保护业务接口。
- 未登录访问 `/api/dashboard` 为什么会返回 401。

重点讲法：

> Laravel 路由负责把前端 URL 请求交给对应控制器。为了避免业务接口裸露，我们把除登录外的接口都放进 `auth.simple` 中间件分组，只有携带合法 token 的请求才能访问。

### 3. 用户管理与基础权限保护

这部分是你新增/明确负责的后端答辩内容，既属于 PHP，又不会大幅影响其他组员分工。

重点文件：

- `backend/app/Http/Controllers/UserController.php`
- `backend/app/Http/Controllers/AuthController.php`
- `backend/app/Models/User.php`
- `backend/tests/Feature/AuthUserManagementTest.php`

你负责解释：

- `/api/users` 只有管理员可以访问。
- 用户管理支持查询、创建、修改和删除。
- 创建/修改用户时后端会校验邮箱、密码和角色。
- 密码由 `User` 模型自动哈希，不保存明文。
- 系统至少保留一个管理员，不能删除当前登录用户，避免系统失去管理入口。

讲法：

> 用户管理不是完整 RBAC，而是课程范围内的简化权限控制。登录接口负责生成 token，`auth.simple` 负责确认请求身份，`UserController` 再判断当前用户是否为管理员，只有管理员才能维护用户数据。

### 4. 数据库设计统筹

数据库基础字段由邢文博讲，你只负责解释自己架构部分需要用到的整体关系，不替他展开所有表字段。

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

### 5. 前后端接口集成

你不主讲前端页面实现。答辩时只把前端作为“如何调用 PHP 后端”的证明，避免老师把注意力带到 React 细节上。

本次增强后的样本详情、首页近期分析建议、分析报告摘要展示，属于较难的接口集成点，由你负责说明“前端如何通过 API 证明后端数据可用”。基础较弱组员只需要知道这些功能有什么用，不需要深入讲 React 状态和接口刷新细节。

重点文件：

- `frontend/src/App.tsx`
- `frontend/src/api.ts`
- `frontend/src/hooks/useOceanData.ts`
- `frontend/src/pages/*.tsx`

重点页面：

- `frontend/src/pages/SamplesPage.tsx`：样本登记、样本详情、检测结果/异常/分析报告展示。
- `frontend/src/pages/DashboardPage.tsx`：首页统计、近期异常、近期分析建议。

讲法：

> 前端页面本身不是重点，重点是页面表单会通过 `api.ts` 调用 PHP 后端接口，后端校验后写入 SQLite，再把 JSON 返回前端刷新页面。

## 你应该主动讲的 PHP 内容

### 1. Laravel 后端不是随便写 PHP 文件

可以这样说：

> Laravel 项目有固定结构：路由在 `routes/api.php`，业务处理在 Controller，数据库表对应 Model，建表用 migration，初始数据用 seeder。我们按照 Laravel 的 MVC 思路组织后端代码。

### 2. 为什么业务接口要登录保护

可以这样说：

> 如果只在前端限制登录，别人仍然可以直接访问后端接口，所以我们在 PHP 后端加了 token 中间件。这样登录不是页面装饰，而是后端接口真实校验。

### 3. 为什么用户管理要放在后端判断

可以这样说：

> 用户是否是管理员不能只靠前端页面隐藏按钮判断，因为前端请求可以被伪造。后端在 `UserController` 中再次判断当前 token 对应的用户角色，只有管理员才能查询、创建、修改和删除用户。

### 4. 为什么检测异常由后端判断

这属于林宇涵的主讲内容。你只需要从架构角度补一句：

> 检测值是否异常属于业务规则，必须由 PHP 后端统一计算，不能只依赖前端显示。具体判断逻辑由负责 `ResultController` 的同学说明。

### 5. 为什么要写测试

可以这样说：

> 后端 Feature Test 模拟真实 HTTP 请求，从登录、创建任务、登记样本、录入结果、自动异常、处理异常到首页统计都验证了一遍，说明项目不是静态页面。

## 你的演示讲解边界

你只负责串联自己范围内的后端入口和接口集成，不替其他组员讲完整业务细节：

1. 登录系统，说明 `/api/login` 和 token。
2. 打开首页，说明统计数据来自 `/api/dashboard`，不是静态页面。
3. 进入用户管理，说明 `/api/users` 只有管理员能访问。
4. 指出业务页面通过 `api.ts` 请求 `/api/*`，再由 `routes/api.php` 分发到控制器。
5. 展示任务、样本、结果、异常和分析页面时，只说明它们都是后端 JSON 接口返回的数据；具体业务控制器由对应负责人讲。
6. 回到首页，说明数据变化能证明 Laravel 后端和 SQLite 数据库真实参与。

## 你负责回答的追问

只回答与你负责范围直接相关的问题：

- Laravel 后端入口为什么是 `routes/api.php`？
- 为什么登录后要携带 token？
- 为什么业务接口要放进 `auth.simple` 中间件？
- 为什么用户管理必须由后端判断管理员？
- 为什么不能删除最后一个管理员或当前登录用户？
- 前端页面的数据从哪里来？
- 如何证明不是静态页面？
- Laravel 项目结构中哪些是框架生成的，哪些是你们写的？

不属于你主讲范围的问题，可以这样收住：

> 这个问题属于对应同学负责的具体模块，我负责的是后端总体架构、API 入口、登录保护和用户管理。我的部分里可以说明请求会先经过路由和中间件，再进入对应控制器。

## 常见答辩问题

### 你的 PHP 部分到底是什么？

答：

> 我负责 PHP 后端总体架构、API 路由入口、登录中间件、用户管理、数据库关系的整体说明，以及前后端接口如何打通。具体业务控制器由对应组员负责，我不会替其他同学答辩，但能说明这些控制器在 Laravel 后端结构中的位置。

### 你为什么还负责前端？

答：

> 因为这是前后端分离项目，我负责把前端页面操作和 PHP 后端接口打通。前端不是孤立页面，而是用来验证 PHP 后端 API 和数据库流程是否真正可用。

### 如果老师问项目最核心的 PHP 设计是什么？

答：

> 核心是 Laravel 的路由、控制器、模型、迁移和中间件组合：路由接收 API，请求先经过 token 中间件，再进入控制器，控制器用模型操作 SQLite，最后返回 JSON 给前端。
