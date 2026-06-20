import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter} from "lucide-react";
import { mockCases } from "../../components/data/mockData";
import { useTranslation } from "react-i18next";
import { FolderSearch , Download} from "lucide-react";

export function CaseManagement() {
  
  const { t } = useTranslation();

  const navigate = useNavigate();

  const statusBadgeColors: Record<string, string> = {
    "Pending Approval": "bg-yellow-100 text-yellow-800",
    "Under Investigation": "bg-blue-100 text-blue-800",
    "Approved": "bg-green-100 text-green-800",
    "Rejected": "bg-red-100 text-red-800",
    "Completed": "bg-gray-100 text-gray-800",
    "Draft": "bg-gray-100 text-gray-800",
    "In Progress": "bg-blue-100 text-blue-800",
  };

  const years = [
    "all",
    ...Array.from(
      new Set(
        mockCases.map((c) =>
          new Date(c.date).getFullYear().toString()
        )
      )
    ).sort((a, b) => Number(b) - Number(a)),
  ];

  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filtered = mockCases.filter((c) => {
    const matchSearch =
      c.case_id
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      c.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      c.institution
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchYear =
      selectedYear === "all" ||
      new Date(c.date).getFullYear().toString() ===
        selectedYear;

    const matchStatus =
      selectedStatus === "all" ||
      c.status === selectedStatus;

    return (
      matchSearch &&
      matchYear &&
      matchStatus
    );
  });

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
              {filtered.length} {t("caseManagement.casesFound")}
            </p>
          </div>
        </div>
      </div>

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

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(e.target.value)
            }
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">
              All Years
            </option>

            {years
              .filter((y) => y !== "all")
              .map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value)
            }
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Under Investigation">
              Under Investigation
            </option>

            <option value="Approved">
              Approved
            </option>

            <option value="Rejected">
              Rejected
            </option>
          </select>

          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {filtered.length} Results
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
                  {t(
                    "caseManagement.table.status"
                  )}
                </th>

                {/* <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t(
                    "caseManagement.table.actions"
                  )}
                </th> */}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/cases/${c.id}/details`)}
                >
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs font-semibold text-blue-700">
                      {c.case_id}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-800 text-xs">
                      {c.title}
                    </div>

                    <div className="text-gray-400 text-xs">
                      {c.location}
                    </div>
                  </td>

                  <td className="px-5 py-3 text-xs text-gray-600">
                    {c.institution}
                  </td>

                  <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {c.date}
                  </td>

                  <td className="px-5 py-3 text-xs text-gray-600">
                    {statusBadgeColors[c.status] ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadgeColors[c.status]}`}
                      >
                        {c.status}
                      </span>
                    ) : (
                      <span className="text-gray-500">{c.status}</span>
                    )}
                  </td>

                  {/* <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      
                      <button
                         onClick={() =>
                          navigate(
                            `/cases/${c.id}/details`
                          )
                        }
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/cases/${c.id}/approval-workflow`
                          )
                        }
                        className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"
                        title="Approval Workflow"
                      >
                        <Workflow className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
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
            {filtered.length}{" "}
            {t("caseManagement.pagination.of")}{" "}
            {mockCases.length}{" "}
            {t(
              "caseManagement.pagination.cases"
            )}
          </span>

          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50">
              {t(
                "caseManagement.pagination.previous"
              )}
            </button>

            <button
              className="px-3 py-1.5 rounded text-xs text-white"
              style={{ background: "#1E40AF" }}
            >
              1
            </button>

            <button className="px-3 py-1.5 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50">
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