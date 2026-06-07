<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MixMatchController;
use App\Http\Controllers\ForgotPasswordController;

// Pages
Route::view('/', 'index');
Route::view('/lemari', 'lemari');
Route::view('/mixmatch', 'mixmatch');
Route::view('/planner', 'planner');
Route::view('/kategori', 'kategori');
Route::view('/warna', 'warna');
Route::view('/profil', 'profile');
Route::view('/masuk', 'masuk');
Route::view('/daftar', 'daftar');

// Forgot & Reset Password 
Route::get('/lupa-password', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('/lupa-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('/reset-password/{token}', [ForgotPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword'])->name('password.update');
Route::view('/lupapassword', 'lupapassword');
Route::view('/resetpassword', 'resetpassword');

// AI API
Route::post('/api/groq-recommendation', [MixMatchController::class, 'panggilGroq']);

use App\Http\Controllers\AuthController;

// Halaman Tampilan
Route::get('/', function () { return view('index'); })->name('home');
Route::get('/masuk', function () { return view('masuk'); })->name('login');
Route::get('/daftar', function () { return view('daftar'); });
Route::get('/profil', function () { return view('profile'); })->middleware('auth'); // Hanya bisa dibuka jika sudah login

// Eksekusi Form (Database)
Route::post('/proses-daftar', [AuthController::class, 'daftar'])->name('register.post');
Route::post('/proses-masuk', [AuthController::class, 'masuk'])->name('login.post');
Route::post('/proses-keluar', [AuthController::class, 'keluar'])->name('logout.post');