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

进入后端目录：

```bash
cd backend
```

安装依赖：

```bash
composer install
```

创建环境文件：

```bash
cp .env.example .env
```

生成应用密钥：

```bash
php artisan key:generate
```

确认 `.env` 使用 SQLite：

```text
DB_CONNECTION=sqlite
```

创建 SQLite 数据库文件：

```bash
touch database/database.sqlite
```

运行迁移和种子数据：

```bash
php artisan migrate --seed
```

启动后端服务：

```bash
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
