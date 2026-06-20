<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * 用户工厂。
 *
 * Factory 主要用于测试中快速生成假用户，例如 AuthUserManagementTest 会用它创建管理员和普通用户。
 *
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /** 缓存测试密码哈希，避免每创建一个用户都重新计算。 */
    protected static ?string $password;

    /** 定义默认用户数据。 */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => 'user',
        ];
    }
}
