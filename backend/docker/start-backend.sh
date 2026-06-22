#!/usr/bin/env sh
set -eu

if [ ! -f vendor/autoload.php ]; then
  composer install --no-interaction --prefer-dist
fi

if [ ! -f .env ]; then
  cp .env.example .env
fi

mkdir -p database storage/logs storage/framework/cache/data storage/framework/sessions storage/framework/views bootstrap/cache

# 只确保 SQLite 数据库文件存在，绝不能用重定向清空它。
# Docker 重启会再次执行本脚本；如果这里写成 `: > database/database.sqlite`，
# 每次重启都会把数据库截断成空文件，前端新建的用户、任务、样本等数据都会丢失。
touch database/database.sqlite

if ! grep -q '^APP_KEY=base64:' .env; then
  php artisan key:generate --force
fi

php artisan migrate --seed --force
php artisan serve --host=0.0.0.0 --port=8000
