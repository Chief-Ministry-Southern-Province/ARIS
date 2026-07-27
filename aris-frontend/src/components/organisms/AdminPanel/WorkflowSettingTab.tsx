import { useEffect, useState } from "react";
import { Save, Settings2 } from "lucide-react";
import Loader from "@/components/atoms/Loader";
import { useUpdateWorkflowSettings, useWorkflowSettings } from "@/hooks/useWorkflowSetting";
import type { WorkflowSetting } from "@/types/workflow-setting.type";

const EMPTY_WORKFLOW_SETTINGS: WorkflowSetting[] = [];

const WorkflowSettingTab = () => {
  const { data: settings = EMPTY_WORKFLOW_SETTINGS, isLoading, isError } = useWorkflowSettings();
  const updateSettings = useUpdateWorkflowSettings();
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues(Object.fromEntries(settings.map((setting) => [setting.key, setting.value])));
  }, [settings]);

  const updateValue = (setting: WorkflowSetting, value: string | boolean) => {
    setValues((current) => ({
      ...current,
      [setting.key]: String(value),
    }));
  };

  const save = () => {
    updateSettings.mutate({
      settings: settings.map((setting) => ({
        key: setting.key,
        value: setting.type === "boolean"
          ? values[setting.key] === "true"
          : values[setting.key] ?? setting.value,
      })),
    });
  };

  if (isLoading) return <Loader text="Loading workflow settings..." />;

  if (isError) {
    return <p className="py-8 text-center text-sm text-red-600">Unable to load workflow settings.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Workflow Settings</h2>
          <p className="mt-1 text-sm text-gray-500">Configure the approval rules used for newly submitted reports.</p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={updateSettings.isPending || settings.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {updateSettings.isPending ? "Saving..." : "Save settings"}
        </button>
      </div>

      {settings.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">No workflow settings are available.</p>
      ) : (
        <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
          {settings.map((setting) => (
            <div key={setting.key} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <Settings2 className="h-4 w-4 text-blue-700" />
                  {setting.description}
                </div>
                <p className="mt-1 font-mono text-xs text-gray-400">{setting.key}</p>
              </div>

              {setting.type === "boolean" ? (
                <label className="inline-flex shrink-0 cursor-pointer items-center gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={(values[setting.key] ?? setting.value) === "true"}
                    onChange={(event) => updateValue(setting, event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-blue-500"
                  />
                  Enabled
                </label>
              ) : (
                <input
                  type={setting.type === "integer" ? "number" : "text"}
                  min={setting.type === "integer" ? 0 : undefined}
                  value={values[setting.key] ?? setting.value}
                  onChange={(event) => updateValue(setting, event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-56"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowSettingTab;
