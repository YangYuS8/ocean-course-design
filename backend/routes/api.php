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

Route::post('/login', [AuthController::class, 'login']);
Route::get('/me', [AuthController::class, 'me']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{user}', [UserController::class, 'update']);
Route::delete('/users/{user}', [UserController::class, 'destroy']);

Route::get('/dashboard', [DashboardController::class, 'show']);

Route::get('/tasks', [TaskController::class, 'index']);
Route::post('/tasks', [TaskController::class, 'store']);
Route::post('/tasks/{task}/start', [TaskController::class, 'start']);
Route::post('/tasks/{task}/submit', [TaskController::class, 'submit']);

Route::get('/samples', [SampleController::class, 'index']);
Route::post('/samples', [SampleController::class, 'store']);
Route::get('/samples/{sample}', [SampleController::class, 'show']);
Route::post('/samples/{sample}/results', [ResultController::class, 'store']);
Route::post('/samples/{sample}/analyze', [AnalysisController::class, 'store']);

Route::get('/results', [ResultController::class, 'index']);

Route::get('/exceptions', [ExceptionController::class, 'index']);
Route::post('/exceptions', [ExceptionController::class, 'store']);
Route::post('/exceptions/{exception}/resolve', [ExceptionController::class, 'resolve']);
