import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWorkflowSettings, updateWorkflowSettings } from "@/services/workflowSetting.service";
import { toast } from "react-toastify";

export function useUpdateWorkflowSettings() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateWorkflowSettings,
        onSuccess: () => {
            toast.success("Workflow settings updated.");
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
