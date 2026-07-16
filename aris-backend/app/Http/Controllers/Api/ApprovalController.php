<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Approval\ApproveRequest;
use App\Http\Requests\Approval\RejectRequest;
use App\Http\Resources\ApprovalResource;
use App\Models\AccidentCase;
use App\Models\Approval;
use App\Services\Approval\ApprovalService;
use Illuminate\Http\Request;

class ApprovalController extends Controller
{
    public function __construct(
        protected ApprovalService $approvalService
    ) {}

    /**
     * Pending approvals of logged-in user.
     */
    public function pending(Request $request)
    {
        $approvals = $this->approvalService
            ->getPendingApprovals($request->user());

        return ApprovalResource::collection($approvals);
    }

    /**
     * Approval history of a case.
     * /api/cases/15/approvals?document_type=FR1043&revision=2
     */
    public function history(Request $request,AccidentCase $accidentCase) 
    {
        $approvals = $this->approvalService
            ->getApprovalHistory(
                case: $accidentCase,
                documentType: $request->get('document_type'),
                revision: $request->get('revision')
            );

        return ApprovalResource::collection($approvals);
    }

    /**
     * Read the exact document revision represented by an approval.
     */
    public function document(Approval $approval)
    {
        return $this->approvalService->getDocument($approval);
    }

    /**
     * Approve.
     */
    public function approve(ApproveRequest $request,Approval $approval) 
    {
        $approval = $this->approvalService
            ->approve(
                approval: $approval,
                user: $request->user(),
                comments: $request->comments
            );

        return new ApprovalResource($approval);
    }

    /**
     * Reject.
     */
    public function reject(RejectRequest $request,Approval $approval) 
    {
        $approval = $this->approvalService
            ->reject(
                approval: $approval,
                user: $request->user(),
                comments: $request->comments
            );

        return new ApprovalResource($approval);
    }
}
