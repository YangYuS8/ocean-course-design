---
title: 登录 token 是什么
description: 用本项目 AuthController 和 RequireApiToken 解释登录、token 和接口保护。
---

# 登录 token 是什么

## 先讲核心理解

登录 token 就像一张临时通行证。

1. 用户输入邮箱和密码。
2. 后端确认密码正确。
3. 后端发一张“通行证”给前端，也就是 token。
4. 前端以后访问业务接口，都带着这张通行证。
5. 后端看到通行证有效，才允许访问。

## 本项目相关文件

```text
backend/app/Http/Controllers/AuthController.php
backend/app/Http/Middleware/RequireApiToken.php
backend/routes/api.php
```

## 登录时发生什么？

`AuthController@login` 做这些事：

1. 校验邮箱和密码。
2. 根据邮箱查用户。
3. 用 `Hash::check()` 检查密码。
4. 生成随机 token。
5. 数据库只保存 token 的哈希值。
6. 把明文 token 返回给前端。

## 为什么不直接保存明文 token？

更安全。

如果数据库泄露，别人拿不到真正的 token，只能看到哈希值。

## 中间件做什么？

`RequireApiToken` 像门卫：

- 请求带了正确 token：放行。
- 没带或 token 错了：返回 401 未登录。

## 为什么不能只靠前端判断登录？

因为别人可以绕过网页，直接请求后端接口。

所以必须在 PHP 后端也检查 token。

## 必背说法

> token 是登录后的临时凭证。我们不仅在前端保存 token，还在 Laravel 后端用中间件保护业务接口，未登录访问会返回 401。
