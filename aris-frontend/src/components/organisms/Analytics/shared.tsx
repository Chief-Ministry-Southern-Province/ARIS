/* eslint-disable react-refresh/only-export-components */

export const tooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  fontSize: "12px",
  color: "var(--popover-foreground)",
  boxShadow: "0 12px 28px rgba(2, 6, 23, 0.24)",
};

export const GOV_COLORS = ["#1B3A6B", "#2563A8", "#4A7FC1", "#7FAFD9", "#B8D4EC"];
export const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
export const chartGrid = "var(--chart-grid)";
export const chartAxis = "var(--chart-axis)";
export const chartAxisStrong = "var(--chart-axis-strong)";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-semibold mb-4 uppercase tracking-wider text-xs"
      style={{ color: "var(--chart-1)", letterSpacing: "0.08em" }}
    >
      {children}
    </h3>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 ${className}`}
    >
      {children}
    </div>
  );
}
