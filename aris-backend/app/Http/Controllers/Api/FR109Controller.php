<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FR109\SaveFR109Request;
use App\Http\Resources\FR109Resource;
use App\Models\AccidentCase;
use App\Models\FR109;
use App\Services\FR109\FR109Service;

class FR109Controller extends Controller
{
    public function __construct(private readonly FR109Service $fr109Service)
    {
    }

    public function show(AccidentCase $accidentCase)
    {
        $this->authorize('viewForCase', [FR109::class, $accidentCase]);
        $fr109 = $this->fr109Service->latest($accidentCase);

        return $fr109 ? new FR109Resource($fr109) : response()->json(['message' => 'FR109 not found.'], 404);
    }

    public function save(SaveFR109Request $request, AccidentCase $accidentCase)
    {
        $this->authorize('create', [FR109::class, $accidentCase]);
        return new FR109Resource($this->fr109Service->saveDraft($accidentCase, $request->user(), $request->validated('data')));
    }

    public function submit(SaveFR109Request $request, AccidentCase $accidentCase)
    {
        $this->authorize('create', [FR109::class, $accidentCase]);
        $draft = $this->fr109Service->saveDraft($accidentCase, $request->user(), $request->validated('data'));

        return new FR109Resource($this->fr109Service->submit($draft, $request->user()));
    }
}
