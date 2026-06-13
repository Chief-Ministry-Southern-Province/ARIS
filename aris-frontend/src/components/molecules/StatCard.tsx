import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/atoms/Card";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle?: string;
  gradient?: string;
  trend?: {
    up: boolean;
    value: string;
  };
}

export function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  gradient = "bg-primary",
  trend,
}: StatCardProps) {
  return (
    <Card className="p-5 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`
            w-11 h-11 rounded-xl
            flex items-center justify-center
            shadow-sm
            ${gradient}
          `}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>

        {trend && (
          <div
            className={`
              flex items-center gap-1
              px-2 py-1
              rounded-lg
              text-xs font-semibold
              ${
                trend.up
                  ? "bg-danger-light text-destructive"
                  : "bg-success-light text-success"
              }
            `}
          >
            {trend.up ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {trend.value}
          </div>
        )}
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-1">
        {value}
      </h3>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {title}
      </p>

      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">
          {subtitle}
        </p>
      )}
    </Card>
  );
}