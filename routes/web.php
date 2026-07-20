<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'tools/background-remover')->name('home');
Route::inertia('/outils/icon-generator', 'tools/icon-generator')->name(
    'tools.icon-generator',
);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
