import { Search } from "lucide-react";
import { InputField } from "@/components/atoms/InputField";
import type { UserSearchPanelProps } from "@/types/signature.type";
import { useTranslation } from "react-i18next";

export default function UserSearchPanel({
  searchTerm,
  setSearchTerm,
}: UserSearchPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="relative mb-4">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <InputField
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t("digitalSignature.searchOfficer")}
        className="pl-10"
      />
    </div>
  );
}