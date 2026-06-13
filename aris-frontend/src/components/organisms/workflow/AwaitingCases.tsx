import { useTranslation } from "react-i18next";

const pendingCases = [
  {
    id: "ARIS-2024-001",
    step: "Investigation Officer Review",
    urgent: true,
  },
  {
    id: "ARIS-2024-002",
    step: "Administrative Officer Review",
    urgent: false,
  },
];


const AwaitingCases = () => {

  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        {t("approvalWorkflow.casesAwaitingAction")}
      </h2>

      <div className="space-y-3">
        {pendingCases.map((item) => (
          <div
            key={item.id}
            className={`rounded-xl border p-4 transition-all hover:shadow-sm
            ${
              item.urgent
                ? "border-orange-200 bg-orange-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-blue-700">
                    {item.id}
                  </span>

                  {item.urgent && (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                      High Priority
                    </span>
                  )}
                </div>

                <p className="text-slate-700 mt-2">
                  {item.step}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Waiting for your review
                </p>
              </div>

              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                Review Case
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AwaitingCases