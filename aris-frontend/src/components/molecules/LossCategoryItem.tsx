import { formatLKR } from "@/utils/formatCurrency";

interface LossCategoryItemProps {
  name: string;
  value: number;
  color: string;
}

export function LossCategoryItem({
  name,
  value,
  color,
}: LossCategoryItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-sm"
          style={{ backgroundColor: color }}
        />

        <span className="text-xs text-muted-foreground">
          {name}
        </span>
      </div>

      <span className="text-xs font-semibold text-card-foreground">
        {formatLKR(value)}
      </span>
    </div>
  );
}