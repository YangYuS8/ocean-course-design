<?php

use App\Http\Controllers\AnalysisController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExceptionController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\SampleController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

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
