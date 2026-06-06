import { ChevronRight } from 'lucide-react';
import { mockCases } from '../../data/mockData';
import { useTranslation } from 'react-i18next';

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  "Under Investigation": { bg: "bg-amber-50", text: "text-amber-800", dot: "bg-amber-400" },
  "Pending Approval": { bg: "bg-orange-50", text: "text-orange-800", dot: "bg-orange-400" },
  "Completed": { bg: "bg-emerald-50", text: "text-emerald-800", dot: "bg-emerald-400" },
  "Approved": { bg: "bg-blue-50", text: "text-blue-800", dot: "bg-blue-400" },
  "Draft": { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" },
};

const priorityConfig: Record<string, { bg: string; text: string }> = {
  "Critical": { bg: "bg-red-50", text: "text-red-700" },
  "High": { bg: "bg-orange-50", text: "text-orange-700" },
  "Medium": { bg: "bg-yellow-50", text: "text-yellow-700" },
  "Low": { bg: "bg-green-50", text: "text-green-700" },
};

export const RecentCasesTable = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-gray-800">{t("dashboard.recentCases")}</h3>
          <p className="text-xs text-gray-400 mt-0.5">Last 30 days activity</p>
        </div>
        <button  className="flex items-center gap-1 text-xs font-semibold hover:underline" style={{ color: "#1E40AF" }}>
          View All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100">
              {["Case ID", "Incident", "Institution", "Date", "Priority", "Status", "Loss (LKR)"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockCases.slice(0, 5).map(c => {
              const sc = statusConfig[c.status] ?? { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-400" };
              const pc = priorityConfig[c.priority] ?? { bg: "bg-gray-50", text: "text-gray-700" };
              return (
                <tr key={c.id} className="hover:bg-blue-50/30 cursor-pointer transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold" style={{ color: "#1E40AF" }}>{c.id}</span>
                  </td>
                  <td className="px-4 py-3 max-w-48">
                    <div className="text-xs font-semibold text-gray-800 leading-tight">{c.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5 truncate">{c.location}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{c.institution}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{c.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${pc.bg} ${pc.text}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${sc.bg} ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sc.dot}`} />
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-red-600 whitespace-nowrap">
                    {c.estimatedLoss.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
