# 分工 4：PHP 登录接口、运行命令与测试结果讲解（高子昱）

## 负责定位

这一部分是 PHP 后端中相对可控的部分。你负责讲“登录接口怎么用、默认账号是什么、如何运行项目、如何用测试证明项目可用”。

注意：你不需要深入讲完整权限系统，也不需要讲核心业务算法。老师不允许杨栋森替其他组员答辩，所以你要把登录、默认账号、运行命令和测试结果这些基础问题自己讲熟。

## 负责文件

重点负责：

- `backend/app/Http/Controllers/AuthController.php`
- `backend/app/Models/User.php`
- `backend/tests/Feature/AuthUserManagementTest.php`
- `backend/tests/Feature/DemoFlowTest.php`
- `backend/README.md`

了解但不主讲：

- `UserController.php`
- `RequireApiToken.php`

这些如果被深问，可以说明它们分别属于“用户管理”和“登录保护”模块，不要主动展开到自己讲不清楚的细节。

## 你主要讲什么

### 1. 登录接口

登录接口：

```text
POST /api/login
```

对应文件：

```text
backend/app/Http/Controllers/AuthController.php
```

基础流程：

1. 前端提交邮箱和密码。
2. 后端根据邮箱查询用户。
3. 后端用 `Hash::check()` 校验密码。
4. 校验成功后生成 token。
5. 前端后续请求会携带 token。

背这个说法：

> 登录成功后，后端会返回一个 token。前端之后访问业务接口时会带上这个 token，后端可以通过 token 判断用户是否已登录。

### 2. 默认账号

```text
邮箱：admin@ocean.local
密码：password
```

说明：

> 这个账号由 Seeder 自动生成，方便本地运行和演示。

### 3. User 模型

文件：

```text
backend/app/Models/User.php
```

只需要讲两点：

- `User` 表示系统用户。
- `password => hashed` 表示密码写入数据库时会自动加密，不保存明文密码。

### 4. 测试证明项目可用

你负责讲测试结果，不需要逐行讲测试代码。

运行命令：

```bash
cd backend
php artisan test
```

目前测试结果：

```text
Tests: 7 passed
```

可以这样说：

> 测试会模拟真实接口请求，验证登录、用户管理和完整业务流程。测试通过说明项目不是静态页面，而是真正能通过接口读写数据。

## 必背运行命令

### 后端运行

```bash
cd backend
php artisan migrate:fresh --seed
php artisan serve
```

### 后端测试

```bash
cd backend
php artisan test
```

### 前端运行

```bash
cd frontend
pnpm run dev
```

## 你不要主动展开的内容

不要主动深入讲：

- 中间件内部如何解析 token。
- 用户管理完整增删改查。
- 检测异常自动生成逻辑。
- 数据库外键关系。
- React 前端代码。

如果老师追问，可以这样转接：

> 我负责登录接口和运行测试部分，这个问题涉及后端整体权限/业务逻辑，不属于我的主讲范围。

## 常见答辩问题

### 为什么密码不能明文保存？

答：

> 明文密码如果泄露会很危险，所以 Laravel 会把密码哈希后再保存。

### token 是什么？

答：

> token 可以理解为登录后的临时凭证。前端访问后端接口时带上 token，后端用它判断用户是否登录。

### 如何证明项目能运行？

答：

> 可以执行 `php artisan test`，目前所有测试都通过；也可以现场运行项目，从登录到创建任务、登记样本、录入检测结果完整演示。

### 你的 PHP 部分是什么？

答：

> 我负责 PHP 登录接口、用户模型基础说明、项目运行命令和测试结果讲解，保证项目可以被正常访问和验证。
