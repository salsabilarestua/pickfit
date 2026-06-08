<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MixMatchController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WardrobeController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB; 

// Halaman Tampilan Utama & Auth
Route::get('/', function () { return view('index'); })->name('home');
Route::get('/masuk', function () { return view('masuk'); })->name('login');
Route::get('/daftar', function () { return view('daftar'); });
Route::get('/profil', function () { return view('profile'); })->middleware('auth');

// Halaman Fitur Aplikasi 
Route::get('/lemari', [WardrobeController::class, 'index'])->name('lemari')->middleware('auth');
Route::get('/mixmatch', [WardrobeController::class, 'mixmatch'])->name('mixmatch')->middleware('auth');
Route::get('/planner', [WardrobeController::class, 'planner'])->name('planner')->middleware('auth');

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

// Untuk fitur Mix & Match & Planner
Route::prefix('api')->middleware(['web', 'auth'])->group(function () {
    Route::get('/wardrobe', [WardrobeController::class, 'index']);
    Route::post('/wardrobe', [WardrobeController::class, 'store']);
    Route::delete('/wardrobe/{id}', [WardrobeController::class, 'deleteOutfit']);
    
    Route::get('/outfits', [WardrobeController::class, 'getOutfits']);
    Route::post('/outfits', [WardrobeController::class, 'saveOutfit']);
    Route::delete('/outfits/{id}', [WardrobeController::class, 'deleteOutfit']);

    Route::get('/planner', [WardrobeController::class, 'getPlanner']);
    Route::post('/planner', [WardrobeController::class, 'savePlanner']);
    Route::delete('/planner/{id}', [WardrobeController::class, 'deletePlanner']);
});

// Route Pembersih Cache Server
Route::get('/clear-system', function() {
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    Artisan::call('optimize:clear');
    return "Semua cache di server online berhasil dihapus total!";
});

Route::get('/buat-tabel-dong', function () {
    try {
        DB::statement("SET FOREIGN_KEY_CHECKS = 0");

        // 1. Buat / Reset Tabel Outfits 
        Schema::dropIfExists('outfits');
        Schema::create('outfits', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->longText('preview_snapshot')->nullable();
            $table->string('nama_atasan', 255)->nullable();
            $table->string('nama_bawahan', 255)->nullable();
            $table->longText('items')->nullable(); 
            $table->string('tanggal_jepret', 100)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        // 2. Buat / Reset Tabel Planners
        Schema::dropIfExists('planners');
        Schema::create('planners', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('outfit_id')->nullable();
            $table->string('tanggal_rencana', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        DB::statement("SET FOREIGN_KEY_CHECKS = 1");

        return "🔥 ALHAMDULILLAH! Struktur database OUTFITS & PLANNERS sukses dibersihkan dan diperbarui di Clever Cloud!";
    } catch (\Exception $e) {
        return "Gagal memperbarui tabel: " . $e->getMessage();
    }
});

// FALLBACK 
Route::fallback(function () {
    return view('welcome'); 
});