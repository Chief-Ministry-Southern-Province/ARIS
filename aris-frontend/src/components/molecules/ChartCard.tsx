interface ChartCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  children,
  className = "",
}: ChartCardProps) {
  return (
    <div
      className={`bg-card border border-border rounded-xl shadow-sm p-5 ${className}`}
    >
      {children}
    </div>
  );
}