# 运行指南

## 环境要求

| 工具 | 建议版本 | 用途 |
| --- | --- | --- |
| PHP | 8.3 或以上 | 运行 Laravel 后端 |
| Composer | 2.x | 安装 PHP 依赖 |
| Node.js | 20 或以上 | 运行前端工具链 |
| pnpm | 9 或以上 | 安装前端依赖 |
| SQLite | 随 PHP SQLite 扩展使用 | 本地数据库 |

## 后端启动

### 推荐方式：Docker / Podman Compose

本项目后端依赖 PHP 8.3+、Composer 和 SQLite 扩展。若队友环境不一致，推荐直接使用容器启动：

```bash
docker compose up --build backend
```

容器会自动完成：

- 安装 Composer 依赖；
- 创建 `.env`；
- 生成 `APP_KEY`；
- 创建 `database/database.sqlite`；
- 执行 `php artisan migrate --seed`；
- 在 `0.0.0.0:8000` 启动 Laravel。

容器普通重启只会继续使用已有的 SQLite 文件，不会清空已经通过页面或接口创建的数据。

默认访问地址：`http://127.0.0.1:8000`。

如果需要重置演示数据：

```bash
docker compose exec backend php artisan migrate:fresh --seed
```

注意：这条命令会删除并重建所有数据表。只有在“演示数据乱了，需要恢复初始状态”时才执行；如果要保留刚创建的用户、任务或样本，不要执行它。

### 备用方式：本机 PHP 启动

进入后端目录：

```bash
cd backend
```

安装依赖并初始化：

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```

默认访问地址：`http://127.0.0.1:8000`。

## 前端启动

新开一个终端，进入前端目录：

```bash
cd frontend
```

安装依赖：

```bash
pnpm install
```

启动开发服务：

```bash
pnpm run dev
```

默认访问地址：`http://127.0.0.1:5173`。

## 常用开发命令

### 后端

```bash
# 查看路由
php artisan route:list

# 重新创建数据库并填充演示数据
php artisan migrate:fresh --seed

# 运行后端测试
php artisan test
```

### 前端

```bash
# 开发启动
pnpm run dev

# 构建检查
pnpm run build

# 代码检查
pnpm run lint
```

## 演示前检查清单

- 后端服务已启动，端口为 `8000`。
- 前端服务已启动，端口为 `5173`。
- SQLite 数据库已经执行 `migrate --seed`。
- 首页能打开，主要页面能切换。
- 演示用数据存在，或者可以现场创建。
- 浏览器控制台没有明显接口错误。

## 重置演示数据

如果演示过程中数据被改乱，可以在后端目录执行：

```bash
php artisan migrate:fresh --seed
```

然后刷新前端页面即可。

## 常见启动问题

### `database/database.sqlite` 不存在

执行：

```bash
touch database/database.sqlite
php artisan migrate --seed
```

### 前端请求不到后端

检查后端是否启动，确认 API 地址是否为：

```text
http://127.0.0.1:8000/api
```

### 端口被占用

后端可指定端口：

```bash
php artisan serve --port=8001
```

前端可指定端口：

```bash
pnpm run dev -- --port 5174
```
