import { useMutation } from "@tanstack/react-query";
import { downloadEvidence } from "@/services/evidence.service";

export const useEvidenceDownloadMutation = () => useMutation({
  mutationFn: async ({ accidentId, evidenceId, accidentReferenceNumber }: { accidentId: number; evidenceId: number; accidentReferenceNumber: string }) => {
    const blob = await downloadEvidence(accidentId, evidenceId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${accidentReferenceNumber}_evidence_`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
});
