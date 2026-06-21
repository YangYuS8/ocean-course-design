# 本地运行指南

## 后端

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate:fresh --seed
php artisan serve
```

后端地址：

```text
http://127.0.0.1:8000
```

## 前端

```bash
cd frontend
pnpm install
pnpm run dev
```

前端地址通常是：

```text
http://127.0.0.1:5173
```

## 文档站

```bash
cd docs-site
pnpm install
pnpm run dev
```

## 登录账号

```text
admin@ocean.local
password
```

## 验证命令

```bash
cd backend
php artisan test

cd ../frontend
pnpm run build

cd ../docs-site
pnpm run build
```
