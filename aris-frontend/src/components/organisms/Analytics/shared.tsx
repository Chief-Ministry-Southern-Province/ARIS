/* eslint-disable react-refresh/only-export-components */

export const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #D1D9E0",
  borderRadius: "2px",
  fontSize: "12px",
  color: "#1B3A6B",
};

export const GOV_COLORS = ["#1B3A6B", "#2563A8", "#4A7FC1", "#7FAFD9", "#B8D4EC"];

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-semibold mb-4 uppercase tracking-wider text-xs"
      style={{ color: "#1B3A6B", letterSpacing: "0.08em" }}
    >
      {children}
    </h3>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
