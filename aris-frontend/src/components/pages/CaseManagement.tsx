import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FolderSearch, Download, Loader2 } from "lucide-react";
import { useGetAccidents } from "@/hooks/useAccident";

export function CaseManagement() {

  const { t } = useTranslation();

  const navigate = useNavigate();

  const {
    fetchAccidents,
    accidents,
    loading,
    error,
    currentPage,
    lastPage,
    total,
  } = useGetAccidents();

  const statusBadgeColors: Record<string, string> = {
    "REPORTED": "bg-yellow-100 text-yellow-800",
    "UNDER_INVESTIGATION": "bg-blue-100 text-blue-800",
    "COMPLETED": "bg-green-100 text-green-800",
    "CLOSED": "bg-gray-100 text-gray-800",
  };

  const severityBadgeColors: Record<string, string> = {
    "MINOR": "bg-yellow-100 text-yellow-800",
    "MAJOR": "bg-orange-100 text-orange-800",
    "FATAL": "bg-red-100 text-red-800",
  };

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");

  // Fetch accidents on mount and when filters change
  useEffect(() => {
    fetchAccidents({
      page: 1,
      search,
      status: selectedStatus,
      severity: selectedSeverity,
    });
  }, [search, selectedStatus, selectedSeverity]);

  const handlePageChange = (page: number) => {
    fetchAccidents({
      page,
      search,
      status: selectedStatus,
      severity: selectedSeverity,
    });
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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

          {/* Search */}
          <div className="relative flex-1 min-w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder={`${t("caseManagement.search")}...`}
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) =>
              setSelectedSeverity(e.target.value)
            }
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              All Severity
            </option>
            <option value="MINOR">Minor</option>
            <option value="MAJOR">Major</option>
            <option value="FATAL">Fatal</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value)
            }
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              All Status
            </option>

            <option value="REPORTED">
              Reported
            </option>

            <option value="UNDER_INVESTIGATION">
              Under Investigation
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="CLOSED">
              Closed
            </option>
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
              <p className="text-gray-400 text-sm">Loading accidents...</p>
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
                  {t(
                    "caseManagement.table.status"
                  )}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {accidents.map((accident) => (
                <tr
                  key={accident.id}
                  className="hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/cases/${accident.id}/details`)}
                >
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs font-semibold text-blue-700">
                      {accident.reference_number}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-800 text-xs">
                      {accident.vehicle?.vehicle_number || "N/A"} — {accident.vehicle?.brand || ""} {accident.vehicle?.model || ""}
                    </div>

                    <div className="text-gray-400 text-xs">
                      {accident.location}, {accident.district}
                    </div>
                  </td>

                  <td className="px-5 py-3 text-xs text-gray-600">
                    {accident.institution?.name || "N/A"}
                  </td>

                  <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(accident.accident_date).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${severityBadgeColors[accident.severity] || "bg-gray-100 text-gray-800"}`}
                    >
                      {accident.severity.charAt(0) + accident.severity.slice(1).toLowerCase()}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadgeColors[accident.status] || "bg-gray-100 text-gray-800"}`}
                    >
                      {formatStatus(accident.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>

        {/* Empty State */}
        {!loading && accidents.length === 0 && (
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
            {accidents.length}{" "}
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