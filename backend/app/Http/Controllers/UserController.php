<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * 用户管理控制器。
 *
 * 这是一个简化版账号管理模块，只区分 admin 和 user 两种角色。
 * 它不是完整 RBAC 权限系统，主要用于展示：
 * - 登录用户身份判断；
 * - 管理员才能管理用户；
 * - 创建、修改、删除用户的基础 CRUD；
 * - 至少保留一个管理员，避免系统无法管理。
 */
class UserController extends Controller
{
    /** 管理员查看用户列表。 */
    public function index(Request $request): JsonResponse
    {
        if (! $this->isAdmin($request)) {
            return response()->json(['message' => '需要管理员权限'], 403);
        }

        return response()->json(
            User::query()->latest('id')->get()
        );
    }

    /** 管理员创建用户。 */
    public function store(Request $request): JsonResponse
    {
        if (! $this->isAdmin($request)) {
            return response()->json(['message' => '需要管理员权限'], 403);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'email' => ['required', 'email', 'max:120', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['required', Rule::in(['admin', 'user'])],
        ]);

        // User 模型中 password 字段有 hashed 类型转换，写入时会自动哈希。
        $user = User::query()->create($data);

        return response()->json($user, 201);
    }

    /** 管理员修改用户。 */
    public function update(Request $request, User $user): JsonResponse
    {
        // 这里演示路由模型绑定：URL 中的 {user} 会自动转换为 User $user。
        $currentUser = AuthController::userFromToken($request);

        if (! $currentUser || $currentUser->role !== 'admin') {
            return response()->json(['message' => '需要管理员权限'], 403);
        }

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:80'],
            'email' => ['sometimes', 'required', 'email', 'max:120', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['sometimes', 'nullable', 'string', 'min:6'],
            'role' => ['sometimes', 'required', Rule::in(['admin', 'user'])],
        ]);

        // 如果前端传了空密码，表示不修改密码。
        if (array_key_exists('password', $data) && ($data['password'] === null || $data['password'] === '')) {
            unset($data['password']);
        }

        // 保护规则：不能把最后一个管理员降级为普通用户。
        if (($data['role'] ?? null) === 'user' && $user->role === 'admin' && $this->adminCount() <= 1) {
            return response()->json(['message' => '至少需要保留一名管理员'], 422);
        }

        $user->update($data);

        return response()->json($user->fresh());
    }

    /** 管理员删除用户。 */
    public function destroy(Request $request, User $user): JsonResponse
    {
        $currentUser = AuthController::userFromToken($request);

        if (! $currentUser || $currentUser->role !== 'admin') {
            return response()->json(['message' => '需要管理员权限'], 403);
        }

        if ($currentUser->id === $user->id) {
            return response()->json(['message' => '不能删除当前登录用户'], 422);
        }

        // 保护规则：不能删除最后一个管理员。
        if ($user->role === 'admin' && $this->adminCount() <= 1) {
            return response()->json(['message' => '至少需要保留一名管理员'], 422);
        }

        $user->delete();

        return response()->json(null, 204);
    }

    /** 判断当前请求是否来自管理员。 */
    private function isAdmin(Request $request): bool
    {
        $user = AuthController::userFromToken($request);

        return $user !== null && $user->role === 'admin';
    }

    /** 统计当前管理员数量，用于保护最后一个管理员。 */
    private function adminCount(): int
    {
        return User::query()->where('role', 'admin')->count();
    }
}
