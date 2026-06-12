<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()->where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => '邮箱或密码错误'], 422);
        }

        $token = Str::random(60);
        $user->forceFill(['api_token_hash' => hash('sha256', $token)])->save();

        return response()->json([
            'token' => $token,
            'user' => $user->fresh(),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $this->userFromToken($request);

        if (! $user) {
            return response()->json(['message' => '未登录'], 401);
        }

        return response()->json($user);
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $this->userFromToken($request);

        if (! $user) {
            return response()->json(['message' => '未登录'], 401);
        }

        $user->forceFill(['api_token_hash' => null])->save();

        return response()->json(null, 204);
    }

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

        return User::query()->where('api_token_hash', hash('sha256', $token))->first();
    }
}
