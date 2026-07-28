<?php

namespace App\Services;

use App\Models\WorkflowSetting;
use App\Enums\AuditAction;
use App\Enums\AuditModule;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class WorkflowSettingService
{
  private const CACHE_KEY = 'workflow_settings';

  public function __construct(private AuditLogService $auditLogs)
  {
  }

  /**
   * Cache scalar setting data, not Eloquent models/collections. Model objects
   * are serialized by database cache drivers and can become invalid after a
   * framework or autoloader update.
   */
  public function getSettings(): array
  {
    return Cache::rememberForever(self::CACHE_KEY, function () {
      return WorkflowSetting::query()
        ->get(['key', 'value', 'type'])
        ->mapWithKeys(fn (WorkflowSetting $setting) => [
          $setting->key => [
            'value' => $setting->value,
            'type' => $setting->type,
          ],
        ])
        ->all();
    });
  }

  public function clearCache(): void{
    Cache::forget(self::CACHE_KEY);
  }

  public function get(string $key,mixed $default = null): mixed
  {
    $setting = $this->getSettings()[$key] ?? null;

    if(!$setting){
      return $default;
    }
    
    return match ($setting['type']) {
       'string' => $setting['value'],
       'integer' => (int) $setting['value'],
       'boolean' => filter_var($setting['value'], FILTER_VALIDATE_BOOLEAN),
       'float' => (float) $setting['value'],
       'array' => json_decode($setting['value'], true),
       default => $setting['value'],
    };
  }

  public function set(string $key, mixed $value): void
    {
        $setting = WorkflowSetting::where('key', $key)->firstOrFail();

        $oldValue = $setting->value;
        $storedValue = is_array($value) ? json_encode($value, JSON_THROW_ON_ERROR) : (string) $value;

        $setting->update(['value' => $storedValue]);

        DB::afterCommit(fn () => $this->auditLogs->log(
            AuditAction::UPDATE,
            AuditModule::WORKFLOW,
            $setting,
            ['key' => $key, 'value' => $oldValue],
            ['key' => $key, 'value' => $storedValue],
            'Updated workflow setting '.$key.'.',
        ));

        $this->clearCache();
    } 
}
