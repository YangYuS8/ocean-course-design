<?php

namespace App\Http\Middleware;

use App\Http\Controllers\AuthController;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * 简单 API 登录校验中间件。
 *
 * Middleware（中间件）位于“路由”和“控制器”之间，适合处理所有接口都需要的公共逻辑。
 * 这里的作用是：除登录接口外，业务接口必须携带合法 Bearer Token 才能访问。
 *
 * 课程讲解重点：
 * 1. 前端登录后保存 token；
 * 2. 请求业务接口时通过 Authorization 请求头携带 token；
 * 3. 中间件统一解析 token，不需要每个控制器重复写登录判断；
 * 4. 如果 token 不存在或无效，直接返回 401 未登录。
 */
class RequireApiToken
{
    /**
     * 处理进入控制器之前的请求。
     *
     * @param Closure(Request): Response $next 表示“通过检查后继续执行后面的控制器”
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = AuthController::userFromToken($request);

        if (! $user) {
            return response()->json(['message' => '未登录'], 401);
        }

        // 把当前用户放入 request，后续控制器如有需要可以通过 $request->attributes->get('current_user') 读取。
        $request->attributes->set('current_user', $user);

        return $next($request);
    }
}
