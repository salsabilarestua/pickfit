<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MixMatchController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\AuthController;

// Halaman Tampilan Utama & Auth
Route::get('/', function () { return view('index'); })->name('home');
Route::get('/masuk', function () { return view('masuk'); })->name('login');
Route::get('/daftar', function () { return view('daftar'); });
Route::get('/profil', function () { return view('profile'); })->middleware('auth');

// Halaman Fitur Aplikasi (Views)
Route::view('/lemari', 'lemari');
Route::view('/mixmatch', 'mixmatch');
Route::view('/planner', 'planner');
Route::view('/kategori', 'kategori');
Route::view('/warna', 'warna');

// Fitur Autentikasi (Eksekusi Database)
Route::post('/proses-daftar', [AuthController::class, 'daftar'])->name('register.post');
Route::post('/proses-masuk', [AuthController::class, 'masuk'])->name('login.post');
Route::post('/proses-keluar', [AuthController::class, 'keluar'])->name('logout.post');

// Fitur Lupa & Reset Password
Route::get('/lupapassword', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('/lupapassword', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('/reset-password/{token}', [ForgotPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword'])->name('password.update');

// AI API
Route::post('/api/groq-recommendation', [MixMatchController::class, 'panggilGroq']);