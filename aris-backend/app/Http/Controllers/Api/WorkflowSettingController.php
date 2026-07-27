<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateWorkflowSettingRequest;
use App\Http\Resources\WorkflowSettingResource;
use App\Models\WorkflowSetting;
use App\Services\WorkflowSettingService;
use Illuminate\Http\JsonResponse;

class WorkflowSettingController extends Controller
{
    public function __construct(
        protected WorkflowSettingService $service
    ) {
    }

    public function index()
    {
        return WorkflowSettingResource::collection(
            WorkflowSetting::orderBy('key')->get()
        );
    }

    public function update(
        UpdateWorkflowSettingRequest $request
    ): JsonResponse {

        foreach ($request->validated()['settings'] as $setting) {

            $this->service->set(

                $setting['key'],

                $setting['value']

            );

        }

        return response()->json([

            'message' => 'Workflow settings updated successfully.'

        ]);
    }
}