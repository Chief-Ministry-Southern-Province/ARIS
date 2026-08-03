import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FolderSearch, Download, Loader2 } from "lucide-react";
import { useCases } from "@/hooks/queries/useCaseQueries";
import type { CaseStage, CaseStatus } from "@/types/AccidentCase.type";

export function CaseManagement() {

  const { t } = useTranslation();

  const navigate = useNavigate();

  const statusBadgeColors: Record<string, string> = {
    "OPEN": "bg-yellow-100 text-yellow-800",
    "IN_PROGRESS": "bg-blue-100 text-blue-800",
    "ON_HOLD": "bg-orange-100 text-orange-800",
    "COMPLETED": "bg-green-100 text-green-800",
    "CLOSED": "bg-gray-100 text-gray-800",
  };

  const severityBadgeColors: Record<string, string> = {
    "MINOR": "bg-yellow-100 text-yellow-800",
    "MAJOR": "bg-orange-100 text-orange-800",
    "FATAL": "bg-red-100 text-red-800",
  };

  const priorityBadgeColors: Record<string, string> = {
    "LOW": "bg-gray-100 text-gray-600",
    "MEDIUM": "bg-blue-100 text-blue-700",
    "HIGH": "bg-orange-100 text-orange-700",
    "URGENT": "bg-red-100 text-red-700",
  };

  const [caseNumber, setCaseNumber] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus | "">("");
  const [selectedStage, setSelectedStage] = useState<CaseStage | "">("");
  const [page, setPage] = useState(1);
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
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
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
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) =>
                (setPage(1), setSelectedStage(e.target.value as CaseStage | ""))
            }
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Stages</option>
            <option value="ACCIDENT_REPORTED">Accident Reported</option>
            <option value="FR1043">FR1043</option>
            <option value="FR1044">FR1044</option>
            <option value="FR109">FR109</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) =>
                (setPage(1), setSelectedStatus(e.target.value as CaseStatus | ""))
            }
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              All Status
            </option>

            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
            <option value="CLOSED">Closed</option>
          </select>

          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {total} Results
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
              <p className="text-gray-400 text-sm">Loading cases...</p>
            </div>
          ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t(
                    "caseManagement.table.caseId"
                  )}
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t(
                    "caseManagement.table.incident"
                  )}
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t(
                    "caseManagement.table.institution"
                  )}
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t(
                    "caseManagement.table.date"
                  )}
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Severity
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stage
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Priority
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t(
                    "caseManagement.table.status"
                  )}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {accidentCases.map((accidentCase) => (
                <tr
                  key={accidentCase.id}
                  className="hover:bg-blue-50 transition-colors cursor-pointer"
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
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${severityBadgeColors[accidentCase.accident?.severity] || "bg-gray-100 text-gray-800"}`}
                    >
                      {accidentCase.accident?.severity
                        ? formatLabel(accidentCase.accident.severity)
                        : "N/A"}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-xs text-gray-600">
                    {formatLabel(accidentCase.current_stage)}
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityBadgeColors[accidentCase.priority] || "bg-gray-100 text-gray-800"}`}
                    >
                      {formatLabel(accidentCase.priority)}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadgeColors[accidentCase.status] || "bg-gray-100 text-gray-800"}`}
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
