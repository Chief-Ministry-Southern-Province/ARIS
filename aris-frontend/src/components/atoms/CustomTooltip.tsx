interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: string; color: string }[];
  label?: string;
}

export function CustomTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-card-foreground mb-2">
        {label}
      </p>

      {payload.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2"
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: item.color,
            }}
          />

          <span className="text-muted-foreground">
            {item.name}:
          </span>

          <span className="font-semibold text-card-foreground">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}