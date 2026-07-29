import { InputField } from "@/components/atoms/InputField";
import type { LostItem, FR104_3Data } from "@/types/form_104_3_types";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, Package } from "lucide-react";
import { FormField } from "@/components/molecules/FormField";

interface LostItemsSectionProps {
  formData: FR104_3Data;
  addItem: () => void;
  updateItem: (index: number, field: keyof LostItem, value: string) => void;
  removeItem: (index: number) => void;
}

// Safely parse a numeric string; falls back to 0 for empty/invalid input
const toNumber = (val: string): number => {
  const n = parseFloat(val);
  return Number.isFinite(n) ? n : 0;
};

const formatCurrency = (val: number): string =>
  val.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const LostItemsSection = ({
  formData: { items },
  addItem,
  updateItem,
  removeItem,
}: LostItemsSectionProps) => {
  const { t } = useTranslation();

  const grandTotal = items.reduce(
    (sum, item) => sum + toNumber(item.quantity) * toNumber(item.value),
    0
  );

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">

        <button
          type="button"
          onClick={addItem}
          className="
            flex items-center justify-center gap-2
            px-4 py-2
            text-sm font-medium
            text-sky-700 bg-sky-50
            border border-sky-200
            rounded-lg
            hover:bg-sky-100
            transition-colors
          "
        >
          <Plus size={18} />
          {t("fr104_3.addItem")}
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const lineTotal = toNumber(item.quantity) * toNumber(item.value);

          return (
            <div
              key={index}
              className="
                rounded-xl
                border border-slate-200
                bg-white
                p-4
                shadow-sm
              "
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
                    {index + 1}
                  </span>
                  <h3 className="font-medium text-slate-700">
                    {t("fr104_3.item", "Item")} #{index + 1}
                  </h3>
                </div>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="
                      p-2
                      text-red-600
                      hover:bg-red-50
                      rounded-lg
                      transition-colors
                    "
                    title={t("fr104_3.remove")}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FormField label={t("fr104_3.description")}>
                    <InputField
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                      placeholder={t("fr104_3.description")}
                    />
                  </FormField>
                </div>

                <FormField label={t("fr104_3.quantity")}>
                  <InputField
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", e.target.value)
                    }
                    placeholder={t("fr104_3.quantity")}
                  />
                </FormField>

                <FormField label={t("fr104_3.unit")}>
                  <InputField
                    value={item.unit}
                    onChange={(e) => updateItem(index, "unit", e.target.value)}
                    placeholder={t("fr104_3.unit")}
                  />
                </FormField>

                <FormField label={t("fr104_3.value")}>
                  <InputField
                    type="number"
                    value={item.value}
                    onChange={(e) =>
                      updateItem(index, "value", e.target.value)
                    }
                    placeholder={t("fr104_3.value")}
                  />
                </FormField>

                <div className="flex flex-col justify-end">
                  <span className="text-xs font-medium text-slate-500 mb-1.5">
                    {t("fr104_3.total", "Total")}
                  </span>
                  <div
                    className="
                      flex items-center gap-2
                      h-10 px-3
                      rounded-lg
                      bg-slate-50
                      border border-slate-200
                      text-slate-700 font-semibold
                      read-only
                    "
                  >
                    Rs. {formatCurrency(lineTotal)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {items.length > 0 && (
        <div
          className="
            mt-4
            flex items-center justify-between
            rounded-xl
            bg-sky-50
            border border-sky-200
            px-4 py-3
          "
        >
          <div className="flex items-center gap-2 text-sky-800">
            <Package size={18} />
            <span className="font-medium">
              {t("fr104_3.grandTotal")}
            </span>
          </div>
          <span className="text-lg font-bold text-sky-900">
            Rs. {formatCurrency(grandTotal)}
          </span>
        </div>
      )}
    </div>
  );
};

export default LostItemsSection;