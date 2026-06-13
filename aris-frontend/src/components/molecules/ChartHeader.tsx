import { ChartLegend } from "../atoms/ChartLegend";

interface ChartHeaderProps {
  title: string;
  subtitle: string;
}

export function ChartHeader({
  title,
  subtitle,
}: ChartHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-bold text-card-foreground">
          {title}
        </h3>

        <p className="text-xs text-muted-foreground mt-1">
          {subtitle}
        </p>
      </div>

      <div className="flex gap-3 text-xs text-muted-foreground">
        <ChartLegend
          color="var(--chart-1)"
          label="Accidents"
        />

        <ChartLegend
          color="var(--chart-5)"
          label="Losses"
        />
      </div>
    </div>
  );
}