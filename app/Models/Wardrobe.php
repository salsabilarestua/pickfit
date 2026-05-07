<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wardrobe extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nama_baju',
        'status_baju',
        'foto_baju'
    ];
}