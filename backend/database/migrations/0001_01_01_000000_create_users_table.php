<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 创建用户表。
     *
     * 这是 Laravel 默认用户表的简化改造版，本项目增加了 role 和 api_token_hash：
     * - role 用于区分管理员和普通用户；
     * - api_token_hash 用于保存登录 token 的哈希值。
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // 自增主键
            $table->string('name'); // 用户名
            $table->string('email')->unique(); // 登录邮箱，唯一
            $table->string('password'); // 哈希后的密码
            $table->string('role')->default('user'); // 角色：admin 或 user
            $table->string('api_token_hash')->nullable()->unique(); // 登录 token 哈希，退出登录时清空
            $table->timestamps();
        });
    }

    /** 回滚迁移：删除用户表。 */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
