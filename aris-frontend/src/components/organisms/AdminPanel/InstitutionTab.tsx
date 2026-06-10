import { Search, Plus } from "lucide-react";
import { mockInstitutions } from "../../data/mockData";

const InstitutionTab = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search institutions..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90" style={{ background: "#1E40AF" }}>
          <Plus className="w-4 h-4" />Add Institution
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {mockInstitutions.map(inst => (
          <div key={inst.id} className="p-4 border border-gray-200 rounded-xl hover:border-blue-200 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-gray-800 text-sm">{inst.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{inst.type}</div>
              </div>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{inst.province}</span>
            </div>
            <div className="mt-3 text-xs text-gray-500 space-y-0.5">
              <div>District: <span className="font-medium text-gray-700">{inst.district}</span></div>
              <div>Director: <span className="font-medium text-gray-700">{inst.director}</span></div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-1.5 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50">Edit</button>
              <button className="flex-1 py-1.5 border border-blue-200 rounded text-xs text-blue-600 hover:bg-blue-50">View Cases</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InstitutionTab