import {
  FileText,
  ArrowRight,
} from "lucide-react";
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900">
          {t("approvalWorkflow.casesAwaitingAction")}
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Cases currently waiting for your review and decision.
        </p>
      </div>

      {/* Case List */}
      <div className="p-5 space-y-4">
        {pendingCases.map((item) => (
          <div
            key={item.id}
            className={`
              group
              border
              rounded-xl
              p-4
              transition-all
              duration-200
              hover:shadow-md
              hover:-translate-y-0.5
              ${
                item.urgent
                  ? "border-orange-200 bg-orange-50/50"
                  : "border-slate-200 bg-white"
              }
            `}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Left Side */}
              <div className="flex gap-4">
                <div
                  className={`
                    w-12 h-12
                    rounded-xl
                    flex items-center justify-center
                    shrink-0
                    ${
                      item.urgent
                        ? "bg-orange-100"
                        : "bg-blue-50"
                    }
                  `}
                >
                  <FileText
                    className={`w-6 h-6 ${
                      item.urgent
                        ? "text-orange-600"
                        : "text-blue-600"
                    }`}
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-semibold text-blue-700">
                      {item.id}
                    </span>

                  </div>

                  <h3 className="mt-2 font-semibold text-slate-900">
                    {item.step}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    waiting for your review and decision. Please click "Review" to view case details and take necessary actions.
                  </p>
                </div>
              </div>

              {/* Right Side */}
              <button
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-lg
                  bg-blue-600
                  text-white
                  text-sm
                  font-medium
                  hover:bg-blue-700
                  transition-colors
                "
              >
                {t("approvalWorkflow.review")}

                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AwaitingCases;