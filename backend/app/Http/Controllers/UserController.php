<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if (! $this->isAdmin($request)) {
            return response()->json(['message' => '需要管理员权限'], 403);
        }

        return response()->json(
            User::query()->latest('id')->get()
        );
    }

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

        $user = User::query()->create($data);

        return response()->json($user, 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
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

        if (array_key_exists('password', $data) && ($data['password'] === null || $data['password'] === '')) {
            unset($data['password']);
        }

        if (($data['role'] ?? null) === 'user' && $user->role === 'admin' && $this->adminCount() <= 1) {
            return response()->json(['message' => '至少需要保留一名管理员'], 422);
        }

        $user->update($data);

        return response()->json($user->fresh());
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $currentUser = AuthController::userFromToken($request);

        if (! $currentUser || $currentUser->role !== 'admin') {
            return response()->json(['message' => '需要管理员权限'], 403);
        }

        if ($currentUser->id === $user->id) {
            return response()->json(['message' => '不能删除当前登录用户'], 422);
        }

        if ($user->role === 'admin' && $this->adminCount() <= 1) {
            return response()->json(['message' => '至少需要保留一名管理员'], 422);
        }

        $user->delete();

        return response()->json(null, 204);
    }

    private function isAdmin(Request $request): bool
    {
        $user = AuthController::userFromToken($request);

        return $user !== null && $user->role === 'admin';
    }

    private function adminCount(): int
    {
        return User::query()->where('role', 'admin')->count();
    }
}
