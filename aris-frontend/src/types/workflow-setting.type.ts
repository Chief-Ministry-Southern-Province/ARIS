export interface WorkflowSetting {
    id: number;
    key: string;
    value: string;
    type: "string" | "integer" | "boolean";
    description: string;
}

export interface UpdateWorkflowSetting {
    key: string;
    value: string | number | boolean;
}

export interface UpdateWorkflowSettingsRequest {
    settings: UpdateWorkflowSetting[];
}