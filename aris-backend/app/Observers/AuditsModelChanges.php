<?php

namespace App\Observers;

use App\Enums\AuditAction;
use App\Enums\AuditModule;
use App\Services\AuditLogService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

abstract class AuditsModelChanges
{
    /** @var array<int, array<string, mixed>> */
    private array $beforeUpdate = [];

    public function __construct(protected AuditLogService $auditLogs)
    {
    }

    abstract protected function module(): AuditModule;

    public function created(Model $model): void
    {
        $this->afterCommit(AuditAction::CREATE, $model, [], $model->getAttributes(), 'Created '.class_basename($model).'.');
    }

    public function updating(Model $model): void
    {
        $fields = array_keys($model->getDirty());
        $this->beforeUpdate[spl_object_id($model)] = Arr::only($model->getOriginal(), $fields);
    }

    public function updated(Model $model): void
    {
        $oldValues = $this->beforeUpdate[spl_object_id($model)] ?? [];
        unset($this->beforeUpdate[spl_object_id($model)]);

        if ($oldValues === []) {
            return;
        }

        $this->afterCommit(
            AuditAction::UPDATE,
            $model,
            $oldValues,
            Arr::only($model->getAttributes(), array_keys($oldValues)),
            'Updated '.class_basename($model).'.',
        );
    }

    public function deleted(Model $model): void
    {
        $this->afterCommit(AuditAction::DELETE, $model, $model->getOriginal(), [], 'Deleted '.class_basename($model).'.');
    }

    private function afterCommit(AuditAction $action, Model $model, array $oldValues, array $newValues, string $description): void
    {
        DB::afterCommit(fn () => $this->auditLogs->log(
            $action, $this->module(), $model, $oldValues, $newValues, $description,
        ));
    }
}
