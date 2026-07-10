<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccidentEvidence extends Model
{
    use HasFactory;

    protected $table = 'accident_evidence';

    protected $fillable = [

        'accident_id',

        'original_name',

        'file_name',

        'file_path',

        'mime_type',

        'file_size',

        'evidence_type',

        'description',

        'uploaded_by',
    ];

    public function accident()
    {
        return $this->belongsTo(Accident::class);
    }

    public function uploader()
    {
        return $this->belongsTo(
            User::class,
            'uploaded_by'
        );
    }
}