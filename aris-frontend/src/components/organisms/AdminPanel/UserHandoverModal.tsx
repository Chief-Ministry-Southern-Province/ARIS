import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { UserCheck, AlertTriangle, Loader2 } from "lucide-react";
import Modal from "@/components/molecules/Modal";
import type { User } from "@/types/User.type";
import { handoverWorkload } from "@/services/delegation.service";

interface Props {
  user: User;
  availableUsers: User[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserHandoverModal({
  user,
  availableUsers,
  onClose,
  onSuccess,
}: Props) {
  const { t } = useTranslation();
  const [successorId, setSuccessorId] = useState<number | "">("");
  const [reason, setReason] = useState("");
  const [deactivate, setDeactivate] = useState(true);
  const [loading, setLoading] = useState(false);

  const eligibleSuccessors = availableUsers.filter(
    (u) => u.id !== user.id && (u.is_active ?? true)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!successorId) {
      toast.error(t("handover.selectSuccessorPrompt"));
      return;
    }
    if (!reason.trim()) {
      toast.error(t("handover.provideReasonPrompt"));
      return;
    }

    setLoading(true);
    try {
      const res = await handoverWorkload(user.id, {
        successor_id: Number(successorId),
        reason: reason.trim(),
        deactivate_departing_user: deactivate,
      });

      toast.success(
        t("handover.success", {
          cases: res.reassigned_cases,
          approvals: res.reassigned_approvals,
        })
      );
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || t("handover.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t("handover.title")}
            </h3>
            <p className="text-xs text-gray-500">
              {t("handover.subtitle", { name: user.name })}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <span>
            {t("handover.notice")}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            {t("handover.successorOfficer")} *
          </label>
          <select
            value={successorId}
            onChange={(e) => setSuccessorId(Number(e.target.value) || "")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            required
          >
            <option value="">{t("handover.selectSuccessor")}</option>
            {eligibleSuccessors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.roles?.[0]?.name || "Officer"}) - {s.institution?.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            {t("handover.reason")} *
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("handover.reasonPlaceholder")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="deactivateCheckbox"
            checked={deactivate}
            onChange={(e) => setDeactivate(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="deactivateCheckbox" className="text-xs text-gray-700 select-none">
            {t("handover.deactivateCheckbox", { name: user.name })}
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
            disabled={loading}
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("handover.confirmHandover")}
          </button>
        </div>
      </form>
    </Modal>
  );
}
