import { Search, Plus, Edit2 } from "lucide-react";
import { mockVehicles } from "../../data/mockData";
import AddVehicleForm from "@/components/pages/forms/common/AddVehicleForm";
import Modal from "@/components/molecules/Modal";
import { useState } from "react";

const VehicleTab = () => {

  const [showAddVehicle, setShowAddVehicle] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search vehicles..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button
         onClick={() => setShowAddVehicle(true)}
         className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90" style={{ background: "#1E40AF" }}>
          <Plus className="w-4 h-4" />Register Vehicle
        </button>
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Reg. No.", "Type", "Make & Year", "Institution", "Incidents", "Status", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockVehicles.map(v => (
              <tr key={v.id} className="hover:bg-blue-50/20 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700">{v.regNo}</td>
                <td className="px-4 py-3 text-xs text-gray-700">{v.type}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{v.make}, {v.year}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{v.institution}</td>
                <td className="px-4 py-3">
                  <span className={`font-bold text-sm ${v.incidents >= 5 ? "text-red-600" : v.incidents >= 3 ? "text-orange-600" : "text-green-600"}`}>{v.incidents}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v.status === "Active" ? "bg-green-100 text-green-700" : v.status === "Under Repair" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddVehicle && (
        <Modal onClose={() => setShowAddVehicle(false)}>
          <AddVehicleForm />
        </Modal>
      )}
    </div>
  )
}

export default VehicleTab