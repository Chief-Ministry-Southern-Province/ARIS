import UserListItem from "./UserListItem";
import type { UserListProps } from "@/types/signature.type";

export default function UserList({
  users,
  selectedUser,
  signatures,
  onSelect,
}: UserListProps) {
  return (
    <div className="space-y-2 max-h-150 overflow-y-auto">
      {users.map((user) => (
        <UserListItem
          key={user.id}
          user={user}
          selected={selectedUser === user.id}
          hasSignature={!!signatures[user.id]}
          onClick={() => onSelect(user.id)}
        />
      ))}
    </div>
  );
}