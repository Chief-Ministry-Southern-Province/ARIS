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

    /** Recommended, approved, or rejected decisions made by the logged-in approver. */
    public function decided(Request $request)
    {
        $filters = $request->validate([
            'document_type' => ['nullable', 'in:FR1043,FR1044,FR109'],
            'status' => ['nullable', 'in:RECOMMENDED,APPROVED,REJECTED'],
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        return ApprovalResource::collection($this->approvalService->getDecidedApprovals(
            $request->user(),
            $filters['document_type'] ?? null,
            $filters['status'] ?? null,
            $filters['search'] ?? null,
        ));
    }

    public function stats(Request $request)
    {
        return response()->json([
            'data' => $this->approvalService->getApprovalStats($request->user()),
        ]);
    }

    /**
     * Approval history of a case, grouped by document type and revision.
     * /api/cases/15/approvals?document_type=FR1043&revision=2
     */
    public function history(Request $request,AccidentCase $accidentCase)
    {
        $filters = $request->validate([
            'document_type' => ['nullable', 'in:FR1043,FR1044,FR109'],
            'revision' => ['nullable', 'integer', 'min:1'],
        ]);

        $approvals = $this->approvalService
            ->getApprovalHistory(
                case: $accidentCase,
                documentType: $filters['document_type'] ?? null,
                revision: $filters['revision'] ?? null
            );

        $groups = $approvals
            ->groupBy(fn ($approval) => "{$approval->document_type}:{$approval->revision}")
            ->map(function ($revisionApprovals) {
                $first = $revisionApprovals->first();

                return [
                    'document_type' => $first->document_type,
                    'revision' => $first->revision,
                    'approvals' => ApprovalResource::collection($revisionApprovals)->resolve(),
                ];
            })
            ->values();

        return response()->json(['data' => $groups]);
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
