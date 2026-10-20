import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Loader2 } from "lucide-react";
import Modal from "@/components/molecules/Modal";
import type { User } from "@/types/User.type";
import { createDelegation } from "@/services/delegation.service";

interface Props {
  officer: User;
  availableUsers: User[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function DelegationModal({
  officer,
  availableUsers,
  onClose,
  onSuccess,
}: Props) {
  const { t } = useTranslation();
  const officerRole = officer.roles?.[0]?.name || "";
  const [actingOfficerId, setActingOfficerId] = useState<number | "">("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState<string>("SICK_LEAVE");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Eligible acting officers should have the same role (or admin/eligible) and belong to accessible institution
  const eligibleOfficers = availableUsers.filter(
    (u) => u.id !== officer.id && (u.is_active ?? true)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actingOfficerId) {
      toast.error(t("delegation.selectOfficerPrompt"));
      return;
    }
    if (!startDate) {
      toast.error(t("delegation.selectDatePrompt"));
      return;
    }

    setLoading(true);
    try {
      await createDelegation({
        institution_id: officer.institution?.id,
        officer_id: officer.id,
        acting_officer_id: Number(actingOfficerId),
        role: officerRole,
        start_date: startDate,
        end_date: endDate ? endDate : null,
        reason,
        notes: notes.trim() || null,
      });

      toast.success(
        t("delegation.success", { name: officer.name })
      );
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || t("delegation.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t("delegation.title")}
            </h3>
            <p className="text-xs text-gray-500">
              {t("delegation.subtitle", { name: officer.name, role: officerRole })}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            {t("delegation.actingOfficer")} *
          </label>
          <select
            value={actingOfficerId}
            onChange={(e) => setActingOfficerId(Number(e.target.value) || "")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            required
          >
            <option value="">{t("delegation.selectActingOfficer")}</option>
            {eligibleOfficers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.roles?.[0]?.name || "Officer"}) - {u.institution?.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t("delegation.startDate")} *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t("delegation.endDate")}
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Leave empty if until revoked"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            {t("delegation.reason")} *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            required
          >
            <option value="SICK_LEAVE">{t("delegation.reasons.SICK_LEAVE")}</option>
            <option value="DUTY_LEAVE">{t("delegation.reasons.DUTY_LEAVE")}</option>
            <option value="VACATION">{t("delegation.reasons.VACATION")}</option>
            <option value="RESIGNATION">{t("delegation.reasons.RESIGNATION")}</option>
            <option value="OTHER">{t("delegation.reasons.OTHER")}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            {t("delegation.notes")}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder={t("delegation.notesPlaceholder")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
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
            {t("delegation.save")}
          </button>
        </div>
      </form>
    </Modal>
  );
}
