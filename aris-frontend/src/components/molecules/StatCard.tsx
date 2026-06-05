import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/atoms/Card";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  trend?: string;
}

export function StatCard({
  icon: Icon,
  title,
  value,
  trend,
}: StatCardProps) {
  return (
    <Card>
      <div className="p-5">
        <div className="flex justify-between">
          <Icon className="w-5 h-5 text-primary" />
          {trend && (
            <span className="text-xs text-success">
              {trend}
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold mt-3">
          {value}
        </h3>

        <p className="text-muted-foreground text-sm">
          {title}
        </p>
      </div>
    </Card>
  );
}