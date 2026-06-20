<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * 登录认证控制器。
 *
 * 这个类负责“登录、获取当前用户、退出登录、根据 token 找用户”。
 * 本项目没有引入 Laravel Sanctum 等完整认证包，而是手写一个适合课程讲解的简化 token 方案：
 * - 登录成功后生成随机 token；
 * - 数据库只保存 token 的哈希值，不保存明文；
 * - 前端后续请求通过 Authorization 请求头携带 token；
 * - 后端用 userFromToken() 找到当前登录用户。
 */
class AuthController extends Controller
{
    /** 登录接口：校验邮箱和密码，成功后返回 token 和用户信息。 */
    public function login(Request $request): JsonResponse
    {
        // validate 是 Laravel 的表单校验；失败时会自动返回 422 JSON 错误。
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // 根据邮箱查询用户。User::query() 返回 Eloquent 查询构造器。
        $user = User::query()->where('email', $data['email'])->first();

        // Hash::check 用于校验明文密码和数据库中的哈希密码是否匹配。
        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => '邮箱或密码错误'], 422);
        }

        // 生成 60 位随机 token。真实项目还会设置过期时间，这里保持课程项目易懂。
        $token = Str::random(60);

        // forceFill 可以绕过 fillable 限制写入 api_token_hash；数据库只保存哈希，更安全。
        $user->forceFill(['api_token_hash' => hash('sha256', $token)])->save();

        return response()->json([
            'token' => $token,
            'user' => $user->fresh(), // fresh() 重新从数据库读取最新用户数据
        ]);
    }

    /** 返回当前登录用户。 */
    public function me(Request $request): JsonResponse
    {
        $user = $this->userFromToken($request);

        if (! $user) {
            return response()->json(['message' => '未登录'], 401);
        }

        return response()->json($user);
    }

    /** 退出登录：清空当前用户的 token 哈希。 */
    public function logout(Request $request): JsonResponse
    {
        $user = $this->userFromToken($request);

        if (! $user) {
            return response()->json(['message' => '未登录'], 401);
        }

        $user->forceFill(['api_token_hash' => null])->save();

        // 204 表示请求成功，但不返回正文。
        return response()->json(null, 204);
    }

    /**
     * 从请求头中解析 Bearer Token 并查找用户。
     *
     * Authorization 请求头格式示例：Bearer xxxxxx
     */
    public static function userFromToken(Request $request): ?User
    {
        $header = $request->header('Authorization', '');
        if (! str_starts_with($header, 'Bearer ')) {
            return null;
        }

        $token = trim(substr($header, 7));
        if ($token === '') {
            return null;
        }

        // 前端传明文 token，数据库存哈希；查询时同样计算哈希再比较。
        return User::query()->where('api_token_hash', hash('sha256', $token))->first();
    }
}
