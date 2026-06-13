interface ChartLegendProps {
  color: string;
  label: string;
}

export function ChartLegend({
  color,
  label,
}: ChartLegendProps) {
  return (
    <div className="flex items-center gap-1">
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  );
}