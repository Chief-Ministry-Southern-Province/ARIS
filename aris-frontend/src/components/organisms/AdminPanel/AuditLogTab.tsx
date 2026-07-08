import { Search, Check, X } from "lucide-react";
import { auditLogs } from "../../data/admin";

const AuditLogTab = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search audit logs..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <input type="date" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="2024-03-15" />
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Export CSV</button>
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Time", "User", "Action", "Resource", "IP Address", "Status"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {auditLogs.map(log => (
              <tr key={log.id} className={`hover:bg-blue-50/20 transition-colors ${log.status === "failed" ? "bg-red-50/30" : ""}`}>
                <td className="px-4 py-3 font-mono text-gray-500">{log.time}</td>
                <td className="px-4 py-3 font-medium text-gray-700">{log.user}</td>
                <td className="px-4 py-3 text-gray-600">{log.action}</td>
                <td className="px-4 py-3 text-gray-500 max-w-40 truncate">{log.resource}</td>
                <td className="px-4 py-3 font-mono text-gray-400">{log.ip}</td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1 text-xs font-medium ${log.status === "success" ? "text-green-600" : "text-red-600"}`}>
                    {log.status === "success" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AuditLogTab