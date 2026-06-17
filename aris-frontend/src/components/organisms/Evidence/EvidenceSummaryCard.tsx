import type { LucideIcon } from "lucide-react";

interface EvidenceSummaryCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  color: "blue" | "red" | "green" | "purple" | "slate";
  active?: boolean;
  onClick?: () => void;
}

const colorClasses = {
  blue: {
    border: "border-blue-100",
    icon: "text-blue-400",
    count: "text-blue-400",
    active: "border-blue-500 bg-blue-50",
  },
  red: {
    border: "border-red-100",
    icon: "text-red-400",
    count: "text-red-400",
    active: "border-red-500 bg-red-50",
  },
  green: {
    border: "border-green-100",
    icon: "text-green-400",
    count: "text-green-400",
    active: "border-green-500 bg-green-50",
  },
  purple: {
    border: "border-purple-100",
    icon: "text-purple-400",
    count: "text-purple-400",
    active: "border-purple-500 bg-purple-50",
  },
  slate: {
    border: "border-slate-200",
    icon: "text-slate-400",
    count: "text-slate-400",
    active: "border-slate-500 bg-slate-50",
  },
};

const EvidenceSummaryCard = ({
  title,
  count,
  icon: Icon,
  color,
  active = false,
  onClick,
}: EvidenceSummaryCardProps) => {
  const styles = colorClasses[color];

  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl p-4 shadow-sm cursor-pointer transition-all
        border bg-white hover:shadow-md
        ${active ? styles.active : styles.border}
      `}
    >
      <div className="flex items-center justify-between">
        <Icon className={`w-8 h-8 ${styles.icon}`} />

        <span className={`text-2xl font-bold ${styles.count}`}>
          {count}
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-gray-600">
        {title}
      </p>
    </div>
  );
};

export default EvidenceSummaryCard;