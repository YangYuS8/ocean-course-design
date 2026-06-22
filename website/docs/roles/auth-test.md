---
title: 高子昱：登录、运行和测试
description: 给负责登录和运行验证部分的组员准备的低风险学习页。
---

# 高子昱：登录、运行和测试

你负责的是可演示、可背诵、风险较低的部分。重点是：系统怎么登录，怎么运行，怎么证明不是静态页面。

## 你重点负责的文件

```text
backend/app/Http/Controllers/AuthController.php
backend/app/Models/User.php
backend/tests/Feature/AuthUserManagementTest.php
backend/tests/Feature/DemoFlowTest.php
backend/README.md
```

## 登录怎么讲

简单理解：

> 用户输入邮箱和密码，后端检查正确后返回 token。前端以后访问接口时带上 token，后端就知道用户已经登录。

默认账号：

```text
邮箱：admin@ocean.local
密码：password
```

## 密码为什么要加密？

必背：

> 密码不能明文保存。Laravel 会把密码哈希后再保存，即使数据库泄露，也不会直接看到原密码。

## 测试怎么讲

运行：

```bash
cd backend
php artisan test
```

你可以说：

> 测试会模拟真实接口请求，验证登录、用户管理和完整业务流程。测试通过说明项目不是静态页面。

## 运行命令

后端：

```bash
cd backend
php artisan migrate:fresh --seed
php artisan serve
```

前端：

```bash
cd frontend
pnpm run dev
```

## 你不要主动讲什么

不要主动深入讲：

- 中间件如何解析 token。
- 检测异常生成逻辑。
- 数据库外键关系。
- 所有控制器细节。

如果老师问，可以说：

> 我负责登录、运行和测试验证，这个问题涉及核心业务逻辑，不属于我的主讲范围。

## 你的必背说法

> 我负责登录接口、用户模型基础、运行命令和测试验证。登录成功后后端返回 token，测试通过说明系统能真实完成业务流程。
