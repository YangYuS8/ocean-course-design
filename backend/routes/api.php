<?php

use App\Http\Controllers\AnalysisController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExceptionController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\SampleController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API 路由
|--------------------------------------------------------------------------
|
| 这里定义前端可以访问的 JSON 接口。Laravel 会根据 URL 和 HTTP 方法
| 把请求分发到对应控制器方法，例如 GET /api/tasks 会进入 TaskController@index。
|
| 登录接口公开；其余业务接口放入 auth.simple 中间件分组，表示必须先登录。
*/

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth.simple')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);

    Route::get('/dashboard', [DashboardController::class, 'show']);

    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::post('/tasks/{task}/start', [TaskController::class, 'start']);
    Route::post('/tasks/{task}/submit', [TaskController::class, 'submit']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);

    Route::get('/samples', [SampleController::class, 'index']);
    Route::post('/samples', [SampleController::class, 'store']);
    Route::put('/samples/{sample}', [SampleController::class, 'update']);
    Route::delete('/samples/{sample}', [SampleController::class, 'destroy']);
    Route::get('/samples/{sample}', [SampleController::class, 'show']);
    Route::post('/samples/{sample}/results', [ResultController::class, 'store']);
    Route::post('/samples/{sample}/analyze', [AnalysisController::class, 'store']);

    Route::get('/results', [ResultController::class, 'index']);
    Route::put('/results/{result}', [ResultController::class, 'update']);
    Route::delete('/results/{result}', [ResultController::class, 'destroy']);

    Route::get('/exceptions', [ExceptionController::class, 'index']);
    Route::post('/exceptions', [ExceptionController::class, 'store']);
    Route::post('/exceptions/{exception}/resolve', [ExceptionController::class, 'resolve']);
});
