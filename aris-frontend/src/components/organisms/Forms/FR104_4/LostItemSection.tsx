import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { Plus, Trash2 } from "lucide-react";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import { useTranslation } from "react-i18next";


interface Props {
  formData: FR104_4FormData;
  setFormData: React.Dispatch<
    React.SetStateAction<FR104_4FormData>
  >;
}

export default function LostItemsSection({
  formData,
  setFormData,
}: Props) {

  const { t } = useTranslation();

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      lostItems: [
        ...prev.lostItems,
        {
          id: crypto.randomUUID(),
          description: "",
          unit: "",
          quantity: "",
          estimatedCost: "",
          replacementCost: "",
          fr105Value: "",
          originalCost: "",
        },
      ],
    }));
  };

  const updateItem = (
    index: number,
    field: string,
    value: string
  ) => {


    const updated = [...formData.lostItems];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      lostItems: updated,
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      lostItems: prev.lostItems.filter(
        (_, i) => i !== index
      ),
    }));
  };

  return (
    <div className="space-y-4">
      {formData.lostItems.map((item, index) => (
        <div
          key={item.id}
          className="border rounded-xl p-4 bg-gray-50"
        >
          <div className="grid md:grid-cols-3 gap-4">

            <FormField label={t("fr104_4.lostItems.description")} required>
              <InputField
                value={item.description}
                onChange={(e) =>
                  updateItem(
                    index,
                    "description",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label={t("fr104_4.lostItems.unit")}>
              <InputField
                value={item.unit}
                onChange={(e) =>
                  updateItem(
                    index,
                    "unit",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label={t("fr104_4.lostItems.quantity")}>
              <InputField
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(
                    index,
                    "quantity",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label={t("fr104_4.lostItems.estimatedCost")}>
              <InputField
                type="number"
                value={item.estimatedCost}
                onChange={(e) =>
                  updateItem(
                    index,
                    "estimatedCost",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label={t("fr104_4.lostItems.replacementCost")}>
              <InputField
                type="number"
                value={item.replacementCost}
                onChange={(e) =>
                  updateItem(
                    index,
                    "replacementCost",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label={t("fr104_4.lostItems.fr105Value")}>
              <InputField
                type="number"
                value={item.fr105Value}
                onChange={(e) =>
                  updateItem(
                    index,
                    "fr105Value",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label={t("fr104_4.lostItems.originalCost")}>
              <InputField
                type="number"
                value={item.originalCost}
                onChange={(e) =>
                  updateItem(
                    index,
                    "originalCost",
                    e.target.value
                  )
                }
              />
            </FormField>

          </div>

          <button
            type="button"
            onClick={() => removeItem(index)}
            className="mt-4 text-red-500 flex items-center gap-2"
          >
            <Trash2 size={16} />
            {t("fr104_4.buttons.remove")}
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-blue-700"
      >
        <Plus size={16} />
        {t("fr104_4.buttons.addLostItem")}
      </button>
    </div>
  );
}