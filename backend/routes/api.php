<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskHistoryController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\ShouldBeAdmin;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me',  [AuthController::class, 'me']);

    Route::prefix('/task/')->group(function() {
        Route::get   ('/', [TaskController::class, 'getAll'])->name('tasks');
        Route::post  ('/', [TaskController::class, 'create'])->name('createTask');
        Route::delete('/{id}', [TaskController::class, 'delete'])->middleware(ShouldBeAdmin::class)->name('deleteTask');
        Route::patch ('/{id}', [TaskController::class, 'update'])->name('updateTask');
        Route::get   ('/{id}', [TaskController::class, 'getTask'])->name('getTask');
        Route::get   ('/{id}/history/', [TaskHistoryController::class, 'getTaskHistory'])->name('history');
    });

    Route::prefix('/user/')->middleware(ShouldBeAdmin::class)->group(function() {
        Route::get('/', [UserController::class, 'getAll'])->name('users');
        Route::post('/', [UserController::class, 'create'])->name('createUser');
        Route::patch('/{id}', [UserController::class, 'update'])->name('updateUser');
        Route::get('/{id}', [UserController::class, 'findUser'])->name('findUser');
        Route::delete('/{id}', [UserController::class, 'delete'])->name('deleteUser');
    });
});





