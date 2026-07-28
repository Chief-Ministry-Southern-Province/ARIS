<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkflowSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'description',
    ];
}
