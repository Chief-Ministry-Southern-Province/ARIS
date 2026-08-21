import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FolderSearch, Download, Loader2 } from "lucide-react";
import { useCases } from "@/hooks/queries/useCaseQueries";
import { downloadAccidentCasesCsv } from "@/services/accidentCase.service";
import type { CaseStage, CaseStatus } from "@/types/AccidentCase.type";
import { toast } from "react-toastify";

export function CaseManagement() {

  const { t } = useTranslation();

  const navigate = useNavigate();

  const statusBadgeColors: Record<string, string> = {
    "OPEN": "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/70 dark:text-yellow-200",
    "IN_PROGRESS": "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-200",
    "COMPLETED": "bg-green-100 text-green-800 dark:bg-green-950/70 dark:text-green-200",
  };

  const severityBadgeColors: Record<string, string> = {
    "MINOR": "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/70 dark:text-yellow-200",
    "MAJOR": "bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-200",
    "FATAL": "bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-200",
  };

  const priorityBadgeColors: Record<string, string> = {
    "LOW": "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300",
    "MEDIUM": "bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-200",
    "HIGH": "bg-orange-100 text-orange-700 dark:bg-orange-950/70 dark:text-orange-200",
    "URGENT": "bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-200",
  };

  const stageBadgeColors: Record<string, string> = {
    ACCIDENT_REPORTED: "bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-200",
    FR1043: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-200",
    FR1044: "bg-violet-100 text-violet-800 dark:bg-violet-950/70 dark:text-violet-200",
    FR109: "bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-200",
    CLOSED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  };

  const [caseNumber, setCaseNumber] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus | "">("");
  const [selectedStage, setSelectedStage] = useState<CaseStage | "">("");
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const { data, isLoading: loading, error: queryError } = useCases(
    page,
    caseNumber,
    selectedStatus,
    selectedStage,
  );
  const accidentCases = data?.data ?? [];
  const currentPage = data?.current_page ?? page;
  const lastPage = data?.last_page ?? 1;
  const total = data?.total ?? 0;
  const error = queryError instanceof Error ? queryError.message : "";

  const handlePageChange = (nextPage: number) => setPage(nextPage);

  const exportCsv = async () => {
    setExporting(true);

    try {
      const csv = await downloadAccidentCasesCsv(caseNumber, selectedStatus, selectedStage);
      const url = URL.createObjectURL(csv);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = `case-management-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Unable to export the case CSV file.");
    } finally {
      setExporting(false);
    }
  };

  const formatLabel = (value: string) => {
    return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <FolderSearch className="h-6 w-6 text-blue-700" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("caseManagement.title")}
            </h1>

            <p className="text-sm text-gray-500 mt-0.5">
              {total} {t("caseManagement.casesFound")}
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      {/* filters */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">

          <div className="relative flex-1 min-w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search by case ID or case number"
              value={caseNumber}
              onChange={(event) => {
                setPage(1);
                setCaseNumber(event.target.value);
              }}
              className="w-full rounded-lg border border-border bg-input px-3 py-2 pl-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) =>
                (setPage(1), setSelectedStage(e.target.value as CaseStage | ""))
            }
            className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Stages</option>
            <option value="ACCIDENT_REPORTED">Accident Reported</option>
            <option value="FR1043">FR1043</option>
            <option value="FR1044">FR1044</option>
            <option value="FR109">FR109</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) =>
                (setPage(1), setSelectedStatus(e.target.value as CaseStatus | ""))
            }
            className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">
              All Status
            </option>

            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 dark:border-blue-800 dark:bg-blue-950/80">
            <Filter className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-200">
              {total} Results
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportCsv}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {exporting ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
              <p className="text-gray-400 text-sm">Loading cases...</p>
            </div>
          ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(
                    "caseManagement.table.caseId"
                  )}
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(
                    "caseManagement.table.incident"
                  )}
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(
                    "caseManagement.table.institution"
                  )}
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(
                    "caseManagement.table.date"
                  )}
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Severity
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Stage
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Priority
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(
                    "caseManagement.table.status"
                  )}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {accidentCases.map((accidentCase) => (
                <tr
                  key={accidentCase.id}
                  className="cursor-pointer transition-colors hover:bg-muted"
                  onClick={() => navigate(`/cases/${accidentCase.id}/details`)}
                >
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs font-semibold text-blue-700">
                      {accidentCase.case_number}
                    </span>
                    <div className="text-gray-400 text-xs font-mono">
                      {accidentCase.accident?.reference_number}
                    </div>
                  </td>

                  <td className="px-5 py-3">
                    <div className="text-gray-400 text-xs">
                      {accidentCase.accident?.location}
                    </div>
                  </td>

                  <td className="px-5 py-3 text-xs text-gray-600">
                    {accidentCase.institution?.name || "N/A"}
                  </td>

                  <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {accidentCase.accident?.accident_date
                      ? new Date(accidentCase.accident.accident_date).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${severityBadgeColors[accidentCase.accident?.severity] || "bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-200"}`}
                    >
                      {accidentCase.accident?.severity
                        ? formatLabel(accidentCase.accident.severity)
                        : "N/A"}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${stageBadgeColors[accidentCase.current_stage] || "bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-200"}`}>
                      {formatLabel(accidentCase.current_stage)}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityBadgeColors[accidentCase.priority] || "bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-200"}`}
                    >
                      {formatLabel(accidentCase.priority)}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadgeColors[accidentCase.status] || "bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-200"}`}
                    >
                      {formatLabel(accidentCase.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>

        {/* Empty State */}
        {!loading && accidentCases.length === 0 && (
          <div className="py-12 text-center">
            <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />

            <p className="text-gray-400 text-sm">
              {t(
                "caseManagement.empty.noCases"
              )}
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {t(
              "caseManagement.pagination.showing"
            )}{" "}
            {accidentCases.length}{" "}
            {t("caseManagement.pagination.of")}{" "}
            {total}{" "}
            {t(
              "caseManagement.pagination.cases"
            )}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t(
                "caseManagement.pagination.previous"
              )}
            </button>

            {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1.5 rounded text-xs ${
                  page === currentPage
                    ? "text-white bg-blue-700"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= lastPage}
              className="px-3 py-1.5 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t(
                "caseManagement.pagination.next"
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
