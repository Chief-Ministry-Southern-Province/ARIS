import { useTranslation } from "react-i18next";

interface Props {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

export function SidebarItem({
  icon: Icon,
  label,
  active,
  onClick,
}: Props) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className={`
        w-full
        flex
        items-center
        gap-3
        px-4
        py-3
        rounded-lg
        transition-all

        ${
          active
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent"
        }
      `}
    >
      <Icon size={18} />

      <span>{t(label)}</span>
    </button>
  );
}