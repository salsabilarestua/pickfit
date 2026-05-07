<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WardrobeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::view('/', 'index');

Route::view('/kategori', 'kategori');
Route::get('/lemari', [WardrobeController::class, 'index'])->middleware('auth');
Route::get('/mixmatch', [WardrobeController::class, 'mixmatch'])->middleware('auth');
Route::get('/planner', [WardrobeController::class, 'planner'])->middleware('auth');



Route::view('/masuk', 'auth.login');
Route::view('/daftar', 'auth.register');

Route::view('/profile', 'profile');
Route::view('/warna', 'warna')->middleware('auth');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/planner/save', [WardrobeController::class, 'savePlanner'])->middleware('auth');
Route::post('/lemari/store', [WardrobeController::class, 'store'])->middleware('auth');
Route::delete('/lemari/delete/{id}', [WardrobeController::class, 'destroy'])->middleware('auth');
Route::put('/lemari/update-status/{id}', [WardrobeController::class, 'updateStatus'])->middleware('auth');
Route::post('/mixmatch/save', [WardrobeController::class, 'saveOutfit'])->middleware('auth');
Route::get('/mixmatch/outfits', [WardrobeController::class, 'getOutfits'])->middleware('auth');
Route::delete('/mixmatch/delete/{id}', [WardrobeController::class, 'deleteOutfit'])->middleware('auth');
Route::delete('/planner/delete', [WardrobeController::class, 'deletePlanner'])->middleware('auth');