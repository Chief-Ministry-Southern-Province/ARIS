import { useTranslation } from "react-i18next";
import { FormCard } from "@/components/molecules/FormCard";
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import type { FR109FormData } from "@/types/FR109.type";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  formData: FR109FormData;
  setFormData: React.Dispatch<React.SetStateAction<FR109FormData>>;
}

export default function PropertySection({
  formData,
  setFormData,
}: Props) {
  const { t } = useTranslation();

  const addProperty = () => {
    setFormData((prev) => ({
      ...prev,
      properties: [
        ...prev.properties,
        { id: crypto.randomUUID(), description: "", quantity: "" },
      ],
    }));
  };

  const updateProperty = (index: number, field: "description" | "quantity", value: string) => {
    setFormData((prev) => ({
      ...prev,
      properties: prev.properties.map((property, propertyIndex) =>
        propertyIndex === index ? { ...property, [field]: value } : property,
      ),
    }));
  };

  const removeProperty = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      properties: prev.properties.filter((_, propertyIndex) => propertyIndex !== index),
    }));
  };

  return (
    <FormCard
      part={t("fr109.parts.c")}
      title={t("fr109.sections.particularsOfProperty")}
    >
      <div className="space-y-4">
        {formData.properties.map((property, index) => (
          <div key={property.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <FormField label={t("fr109.fields.descriptionOfProperty")}>
                  <TextAreaField
                    rows={3}
                    value={property.description}
                    onChange={(e) => updateProperty(index, "description", e.target.value)}
                  />
                </FormField>
              </div>

              <FormField label={t("fr109.fields.quantity")}>
                <InputField
                  value={property.quantity}
                  onChange={(e) => updateProperty(index, "quantity", e.target.value)}
                />
              </FormField>
            </div>

            {formData.properties.length > 1 && (
              <button
                type="button"
                onClick={() => removeProperty(index)}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} />
                Remove property
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addProperty}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          <Plus size={16} />
          Add property
        </button>
      </div>
    </FormCard>
  );
}
