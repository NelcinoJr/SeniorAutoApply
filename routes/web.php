<?php

use Illuminate\Support\Facades\Route;
use App\Services\Scraper\ScraperService;
use App\Http\Controllers\Api\LinkedinProfileController;
use App\Http\Controllers\Api\LinkedinSearchController;
use App\Http\Controllers\Api\LinkedinAuthController;

use Inertia\Inertia;

Route::prefix('api')->group(function () {
    Route::post('/linkedin/login', [LinkedinAuthController::class, 'login']);
    Route::get('/linkedin/profile', [LinkedinProfileController::class, 'show']);
    Route::post('/linkedin/search', [LinkedinSearchController::class, 'search']);
});

Route::get('/', function () {
    return Inertia::render('Dashboard');
});

Route::get('/test-scraper', function (ScraperService $scraper) {
    set_time_limit(300); // Aumenta timeout para 5 minutos
    return response()->json([
        'output' => $scraper->runScraper()
    ]);
});
