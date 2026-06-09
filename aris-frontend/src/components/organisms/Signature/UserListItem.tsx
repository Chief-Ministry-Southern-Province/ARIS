import { Check } from "lucide-react";
import type { UserListItemProps } from "@/types/signature.type";

export default function UserListItem({
  user,
  selected,
  hasSignature,
  onClick,
}: UserListItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full
        p-3
        rounded-xl
        border
        transition-all
        text-left
        ${
          selected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            w-10 h-10
            rounded-full
            flex items-center justify-center
            text-white font-semibold
            ${
              hasSignature
                ? "bg-green-500"
                : "bg-slate-500"
            }
          `}
        >
          {hasSignature ? (
            <Check size={16} />
          ) : (
            user.avatar
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 truncate">
            {user.name}
          </h4>

          <p className="text-sm text-gray-500 truncate">
            {user.role}
          </p>
        </div>

        <div
          className={`
            w-3 h-3 rounded-full
            ${
              hasSignature
                ? "bg-green-500"
                : "bg-red-400"
            }
          `}
        />
      </div>
    </button>
  );
}