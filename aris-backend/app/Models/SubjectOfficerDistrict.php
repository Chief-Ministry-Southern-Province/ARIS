<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubjectOfficerDistrict extends Model
{
    protected $fillable = [

        'user_id',

        'district',

    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}