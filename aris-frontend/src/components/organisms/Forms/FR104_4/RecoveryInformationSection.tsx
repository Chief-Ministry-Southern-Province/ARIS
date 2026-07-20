import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  formData: FR104_4FormData;
  setFormData: React.Dispatch<
    React.SetStateAction<FR104_4FormData>
  >;
}

export default function RecoveryInformationSection({
  formData,
  setFormData,
}: Props) {
  const { t } = useTranslation();

  const addRecovery = () => {
    setFormData((prev) => ({
      ...prev,
      recoveries: [
        ...prev.recoveries,
        {
          id: crypto.randomUUID(),
          officer: "",
          amount: "",
          method: "",
        },
      ],
    }));
  };

  const updateRecovery = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...formData.recoveries];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      recoveries: updated,
    }));
  };

  const removeRecovery = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      recoveries: prev.recoveries.filter(
        (_, i) => i !== index
      ),
    }));
  };

  return (
    <div className="space-y-4">

      {formData.recoveries.map(
        (recovery, index) => (
          <div
            key={recovery.id}
            className="border rounded-xl p-4 bg-gray-50"
          >
            <div className="grid md:grid-cols-3 gap-4">

              <FormField
                label={t("fr104_4.recovery.officer")}
              >
                <InputField
                  value={recovery.officer}
                  onChange={(e) =>
                    updateRecovery(
                      index,
                      "officer",
                      e.target.value
                    )
                  }
                />
              </FormField>

              <FormField
                label={t("fr104_4.recovery.amount")}
              >
                <InputField
                  type="number"
                  value={recovery.amount}
                  onChange={(e) =>
                    updateRecovery(
                      index,
                      "amount",
                      e.target.value
                    )
                  }
                />
              </FormField>

              <FormField
                label={t("fr104_4.recovery.method")}
              >
                <InputField
                  value={recovery.method}
                  onChange={(e) =>
                    updateRecovery(
                      index,
                      "method",
                      e.target.value
                    )
                  }
                />
              </FormField>

            </div>

            <button
              type="button"
              onClick={() =>
                removeRecovery(index)
              }
              className="mt-4 text-red-500 flex items-center gap-2"
            >
              <Trash2 size={16} />
              {t("fr104_4.buttons.remove")}
            </button>
          </div>
        )
      )}

      <button
        type="button"
        onClick={addRecovery}
        className="flex items-center gap-2 text-blue-700"
      >
        <Plus size={16} />
        {t("fr104_4.recovery.addItem")}
      </button>

    </div>
  );
}