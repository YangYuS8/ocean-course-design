# 分工 4：登录与测试运行

## 负责范围

- `AuthController` 登录接口。
- `User` 模型基础说明。
- 默认账号。
- `php artisan test` 测试结果。
- 项目运行命令。

## 必背账号

```text
邮箱：admin@ocean.local
密码：password
```

## 必背命令

```bash
cd backend
php artisan migrate:fresh --seed
php artisan serve
php artisan test
```

## 答辩说法

> 我负责登录接口和运行测试部分。登录成功后后端返回 token，测试通过说明项目可以真实运行。
