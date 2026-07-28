import api from "./api";
import type { WorkflowSetting,UpdateWorkflowSettingsRequest } from "@/types/workflow-setting.type";

export const getWorkflowSettings = async (): Promise<WorkflowSetting[]> => {
  const response = await api.get("/workflow-settings");
  return response.data.data;
};

export const updateWorkflowSettings = async (data: UpdateWorkflowSettingsRequest): Promise<void> => {
  await api.put("/workflow-settings", data);
};
