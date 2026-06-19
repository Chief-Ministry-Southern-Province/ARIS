import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter} from "lucide-react";
import { mockCases } from "../../components/data/mockData";
import { useTranslation } from "react-i18next";
import { FolderSearch } from "lucide-react";

export function CaseManagement() {
  
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

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

    return matchSearch;
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

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder={`${t(
                "caseManagement.search"
              )}...`}
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
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