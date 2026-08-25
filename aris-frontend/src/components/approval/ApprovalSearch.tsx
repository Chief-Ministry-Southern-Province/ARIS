import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  search: string;
  onSearch: (value: string) => void;
}

export default function ApprovalSearch({
  search,
  onSearch,
}: Props) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

      <div className="relative">

        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />

        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t("approvalCenter.searchPlaceholder")}
          className="w-full rounded-xl border border-slate-200 pl-12 pr-4 py-3 outline-none focus:border-[#0F4C81]"
        />

      </div>

    </div>
  );
}
