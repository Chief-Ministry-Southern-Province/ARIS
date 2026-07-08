import { InputField } from "@/components/atoms/InputField";
import type {
  LostItem,
  FR104_3Data,
} from "@/types/form_104_3_types";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";

interface LostItemsSectionProps {
  formData: FR104_3Data;
  addItem: () => void;
  updateItem: (
    index: number,
    field: keyof LostItem,
    value: string
  ) => void;
  removeItem: (index: number) => void;
}

const LostItemsSection = ({
  formData: { items },
  addItem,
  updateItem,
  removeItem,
}: LostItemsSectionProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
 
        <button
          type="button"
          onClick={addItem}
          className="
            flex items-center gap-2
            px-4 py-2
            text-blue-600
            rounded-lg
          "
        >
          <Plus size={18} />
          {t("fr104_3.addItem")}
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
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
              <h3 className="font-medium">
                Item #{index + 1}
              </h3>

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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                value={item.description}
                onChange={(e) =>
                  updateItem(
                    index,
                    "description",
                    e.target.value
                  )
                }
                placeholder={t("fr104_3.description")}
              />

              <InputField
                value={item.quantity}
                onChange={(e) =>
                  updateItem(
                    index,
                    "quantity",
                    e.target.value
                  )
                }
                placeholder={t("fr104_3.quantity")}
              />

              <InputField
                value={item.unit}
                onChange={(e) =>
                  updateItem(
                    index,
                    "unit",
                    e.target.value
                  )
                }
                placeholder={t("fr104_3.unit")}
              />

              <InputField
                value={item.value}
                onChange={(e) =>
                  updateItem(
                    index,
                    "value",
                    e.target.value
                  )
                }
                placeholder={t("fr104_3.value")}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LostItemsSection;