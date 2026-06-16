import {ShieldCheck,User} from "lucide-react";

const investigationTeam = [
  {
    id: 1,
    name: "Nimal Perera",
    role: "Lead Investigator"
  },
  {
    id: 2,
    name: "Kasun Silva",
    role: "Investigation Officer",
  },
  {
    id: 3,
    name: "Amila Fernando",
    role: "Technical Officer",
  },
];

const InvestigationTeamTab = () => {

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Investigation Team
            </h2>

            <p className="text-sm text-slate-500">
              {investigationTeam.length} team members assigned
            </p>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {investigationTeam.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    {member.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {member.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestigationTeamTab;