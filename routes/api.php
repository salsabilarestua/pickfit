<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WardrobeController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('web')->group(function () {
    Route::get('/wardrobe', [WardrobeController::class, 'index']);
    Route::post('/wardrobe', [WardrobeController::class, 'store']);
    Route::delete('/wardrobe/{id}', [WardrobeController::class, 'destroy']);
    
    Route::get('/outfits', [WardrobeController::class, 'getOutfits']);
    Route::post('/outfits', [WardrobeController::class, 'saveOutfit']);
    Route::delete('/outfits/{id}', [WardrobeController::class, 'deleteOutfit']);

    // 🔴 TAMBAHKAN TIGA BARIS ROUTE PLANNER INI DI DALAM GRUP WEB BIAR SINKRON DAN BISA DIAKSES:
    Route::get('/planner', [WardrobeController::class, 'getPlanner']);
    Route::post('/planner', [WardrobeController::class, 'savePlanner']);
    Route::delete('/planner/{id}', [WardrobeController::class, 'deletePlanner']);
});