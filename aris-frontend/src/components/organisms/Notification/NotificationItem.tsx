type NotificationItemProps = {
  title: string;
  description: string;
  time: string;
  color: string;
  unread?: boolean;
  onClick?: () => void;
};

const NotificationItem = ({
  title,
  description,
  time,
  color,
  unread = true,
  onClick,
}: NotificationItemProps) => {
  return (
    <button type="button" onClick={onClick} className="w-full text-left px-4 py-3 hover:bg-muted/50 border-b border-border transition-colors">
      <div className="flex gap-3">
        <div
          className={`w-2 h-2 rounded-full mt-2 shrink-0 ${color}`}
        />

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium">
              {title}
            </p>

            {unread && (
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>

          <p className="text-[11px] text-muted-foreground mt-2">
            {time}
          </p>
        </div>
      </div>
    </button>
  );
};

export default NotificationItem;
