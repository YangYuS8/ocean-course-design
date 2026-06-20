<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * 用户模型，对应 users 表。
 *
 * 这里继承 Authenticatable，是 Laravel 为登录用户提供的基础模型类。
 * 本项目只做简化登录：用户有 name、email、password、role，以及 api_token_hash。
 */
#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'remember_token', 'api_token_hash'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * 字段类型转换。
     *
     * password => hashed 表示写入 password 时，Laravel 会自动进行哈希处理，
     * 避免数据库保存明文密码。
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }
}
