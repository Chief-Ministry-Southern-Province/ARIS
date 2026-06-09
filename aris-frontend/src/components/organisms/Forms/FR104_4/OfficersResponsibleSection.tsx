import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import { Plus, Trash2 } from "lucide-react";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import { useTranslation } from "react-i18next";

type Officer = FR104_4FormData["officers"][number];

interface Props {
  formData: FR104_4FormData;
  setFormData: React.Dispatch<
    React.SetStateAction<FR104_4FormData>
  >;
}

export default function OfficersResponsibleSection({
  formData,
  setFormData,
}: Props) {

  const { t } = useTranslation();

  const addOfficer = () => {
    setFormData((prev) => ({
      ...prev,
      officers: [
        ...prev.officers,
        {
          name: "",
          designation: "",
          responsibility: "",
          disciplinaryAction: "",
          punishment: "",
        },
      ],
    }));
  };

  const updateOfficer = (
    index: number,
    field: keyof Officer,
    value: string
  ) => {
    const updated = [...formData.officers];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      officers: updated,
    }));
  };

  const removeOfficer = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      officers: prev.officers.filter(
        (_, i) => i !== index
      ),
    }));
  };

  return (
    <div className="space-y-4">

      {formData.officers.map((officer, index) => (
        <div
          key={index}
          className="border rounded-xl p-4 bg-gray-50"
        >
          <div className="grid md:grid-cols-2 gap-4">

            <FormField label={t("fr104_4.officers.name")}>
              <InputField
                value={officer.name}
                onChange={(e) =>
                  updateOfficer(
                    index,
                    "name",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label={t("fr104_4.officers.designation")}>
              <InputField
                value={officer.designation}
                onChange={(e) =>
                  updateOfficer(
                    index,
                    "designation",
                    e.target.value
                  )
                }
              />
            </FormField>

          </div>

          <div className="mt-4">
            <FormField label={t("fr104_4.officers.responsibility")}>
              <TextAreaField
                rows={3}
                value={officer.responsibility}
                onChange={(e) =>
                  updateOfficer(
                    index,
                    "responsibility",
                    e.target.value
                  )
                }
              />
            </FormField>
          </div>

          <div className="mt-4">
            <FormField label={t("fr104_4.officers.disciplinaryAction")}>
              <TextAreaField
                rows={3}
                value={officer.disciplinaryAction}
                onChange={(e) =>
                  updateOfficer(
                    index,
                    "disciplinaryAction",
                    e.target.value
                  )
                }
              />
            </FormField>
          </div>

          <div className="mt-4">
            <FormField label={t("fr104_4.officers.punishment")}>
              <TextAreaField
                rows={3}
                value={officer.punishment}
                onChange={(e) =>
                  updateOfficer(
                    index,
                    "punishment",
                    e.target.value
                  )
                }
              />
            </FormField>
          </div>

          <button
            type="button"
            onClick={() => removeOfficer(index)}
            className="mt-4 text-red-500 flex items-center gap-2"
          >
            <Trash2 size={16} />
            {t("fr104_4.officers.removeOfficer")}
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addOfficer}
        className="flex items-center gap-2 text-blue-700"
      >
        <Plus size={16} />
        {t("fr104_4.officers.addOfficer")}
      </button>
    </div>
  );
}