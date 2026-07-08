export interface Signatory {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface SignatureMap {
  [userId: string]: string;
}

export interface UserListItemProps {
  user: Signatory;
  selected: boolean;
  hasSignature: boolean;
  onClick: () => void;
}

export interface UserSearchPanelProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export interface UserListProps {
  users: Signatory[];
  selectedUser: string;
  signatures: SignatureMap;
  onSelect: (id: string) => void;
}

export interface SignaturePreviewProps {
  user: Signatory;
  signature?: string;
}

export interface SignatureDetailsProps {
  user: Signatory;
  hasSignature: boolean;
}

export interface SignatureActionsProps {
  hasSignature: boolean;
  drawMode: boolean;
  onDrawToggle: () => void;
  onRemove: () => void;
}

export interface SignatureCanvasProps {
  onSave: (signature: string) => void;
  onCancel: () => void;
}

export interface SignatureStatsProps {
  users: Signatory[];
  signatures: SignatureMap;
}