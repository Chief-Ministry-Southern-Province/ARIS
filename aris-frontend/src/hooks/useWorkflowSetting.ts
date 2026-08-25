import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWorkflowSettings, updateWorkflowSettings } from "@/services/workflowSetting.service";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export function useUpdateWorkflowSettings() {
    const { t } = useTranslation();

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateWorkflowSettings,
        onSuccess: () => {
            toast.success(t("adminPanel.workflow.saveSuccess"));
            queryClient.invalidateQueries({
                queryKey: ["workflow-settings"],
            });
        },
    });

}

export function useWorkflowSettings() {
    return useQuery({
        queryKey: ["workflow-settings"],
        queryFn: getWorkflowSettings,
    });
}
