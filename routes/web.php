<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('index');
});

Route::get('/lemari', function () {
    return view('lemari');
});

Route::get('/kategori', function () {
    return view('kategori');
});

Route::get('/warna', function () {
    return view('warna');
});

Route::get('/planner', function () {
    return view('planner');
});

Route::get('/profil', function () {
    return view('profile');
});

Route::get('/masuk', function () {
    return view('masuk');
});

Route::get('/daftar', function () {
    return view('daftar');
});

Route::get('/mixmatch', function () {
    return view('mixmatch');
});

Route::get('/lupapassword', function () {
    return view('lupapassword');
});

Route::get('/resetpassword', function () {
    return view('resetpassword');
});


use App\Http\Controllers\MixMatchController;

use App\Http\Controllers\ForgotPasswordController;

// Rute untuk meminta link reset (Gambar 1)
Route::get('/lupa-password', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('/lupa-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');

// Rute ketika user klik tombol dari dalam Gmail (Gambar 2)
Route::get('/reset-password/{token}', [ForgotPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword'])->name('password.update');

Route::post('/api/gemini-recommendation', [MixMatchController::class, 'panggilGemini']);