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

use App\Http\Controllers\MixMatchController;

Route::post('/api/gemini-recommendation', [MixMatchController::class, 'panggilGemini']);