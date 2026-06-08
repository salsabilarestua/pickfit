<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wardrobe extends Model
{
    use HasFactory;

    protected $table = 'wardrobe';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'category',
        'image_url',
    ];
}