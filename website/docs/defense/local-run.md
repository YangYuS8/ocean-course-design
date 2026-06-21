---
title: 本地运行和常见问题
description: 用最少命令启动后端、前端和文档站，并解释常见错误。
---

# 本地运行和常见问题

## 启动后端

```bash
cd backend
php artisan migrate:fresh --seed
php artisan serve
```

后端地址：

```text
http://127.0.0.1:8000
```

## 启动前端

另开一个终端：

```bash
cd frontend
pnpm run dev
```

前端地址一般是：

```text
http://127.0.0.1:5173
```

## 登录账号

```text
邮箱：admin@ocean.local
密码：password
```

## 启动补课站

```bash
cd website
pnpm run dev
```

## 常见错误

### 1. 前端提示未登录

先确认后端有没有启动，再重新登录。

### 2. 数据不对或想重置

运行：

```bash
cd backend
php artisan migrate:fresh --seed
```

### 3. 前端连不上后端

检查前端默认接口：

```text
http://127.0.0.1:8000/api
```

如果后端端口不是 8000，需要改 `frontend/.env.local`。

### 4. 如何证明项目能跑？

运行测试：

```bash
cd backend
php artisan test
```

再运行前端构建：

```bash
cd frontend
pnpm run build
```
