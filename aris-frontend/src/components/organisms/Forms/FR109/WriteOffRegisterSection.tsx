import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import { FormCard } from "@/components/molecules/FormCard";
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import type { FR109FormData, WriteOffEntry } from "@/types/FR109.type";

interface Props {
  formData: FR109FormData;
  setFormData: React.Dispatch<React.SetStateAction<FR109FormData>>;
}

export default function WriteOffRegisterSection({
  formData,
  setFormData,
}: Props) {
  const { t } = useTranslation();
  const entries = formData.writeOffEntries?.length
    ? formData.writeOffEntries
    : [emptyEntry];

  const updateEntry = (index: number, field: keyof WriteOffEntry, value: string) =>
    setFormData((previous) => {
      const next = previous.writeOffEntries?.length
        ? [...previous.writeOffEntries]
        : [{ ...emptyEntry }];
      next[index] = { ...next[index], [field]: value };

      return { ...previous, writeOffEntries: next };
    });

  const addEntry = () =>
    setFormData((previous) => ({
      ...previous,
      writeOffEntries: [
        ...(previous.writeOffEntries?.length ? previous.writeOffEntries : [{ ...emptyEntry }]),
        { ...emptyEntry },
      ],
    }));

  const removeEntry = (index: number) =>
    setFormData((previous) => {
      const current = previous.writeOffEntries?.length
        ? previous.writeOffEntries
        : [{ ...emptyEntry }];
      const next = current.filter((_, entryIndex) => entryIndex !== index);

      return { ...previous, writeOffEntries: next.length ? next : [{ ...emptyEntry }] };
    });

  return (
    <FormCard
      part={t("fr109.parts.g")}
      title={t("fr109.sections.writeOffNotedIn")}
    >
      <div className="space-y-5">
        {entries.map((entry, index) => (
          <div key={index} className="relative rounded-xl border border-slate-200 p-4 pt-6">
            <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-semibold text-slate-500">
              Row {index + 1}
            </div>

            {entries.length > 1 && (
              <button
                type="button"
                onClick={() => removeEntry(index)}
                className="absolute -top-3 right-4 flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
              >
                <Trash2 size={14} />
                {t("fr109.fields.remove")}
              </button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <FormField label={t("fr109.fields.stockBookFolio")}>
                <InputField value={entry.stockBookFolio} onChange={(event) => updateEntry(index, "stockBookFolio", event.target.value)} />
              </FormField>
              <FormField label={t("fr109.fields.inventoryBookFolio")}>
                <InputField value={entry.inventoryBookFolio} onChange={(event) => updateEntry(index, "inventoryBookFolio", event.target.value)} />
              </FormField>
              <FormField label={t("fr109.fields.fixedAssetsRegisterFolio")}>
                <InputField value={entry.fixedAssetsRegisterFolio} onChange={(event) => updateEntry(index, "fixedAssetsRegisterFolio", event.target.value)} />
              </FormField>
              <FormField label={t("fr109.fields.ledgerFolio")}>
                <InputField value={entry.ledgerFolio} onChange={(event) => updateEntry(index, "ledgerFolio", event.target.value)} />
              </FormField>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addEntry} className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-blue-400 hover:text-blue-700">
        <Plus size={16} />
        Add row
      </button>
    </FormCard>
  );
}

const emptyEntry: WriteOffEntry = {
  stockBookFolio: "",
  inventoryBookFolio: "",
  fixedAssetsRegisterFolio: "",
  ledgerFolio: "",
};
