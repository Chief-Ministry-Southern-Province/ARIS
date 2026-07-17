import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { Plus, Trash2 } from "lucide-react";
import  type { FR104_4FormData } from "@/types/FR104_4_types";
import { useTranslation } from "react-i18next";

interface Props {
  formData: FR104_4FormData;
  setFormData: React.Dispatch<
    React.SetStateAction<FR104_4FormData>
  >;
}

export default function BoardOfInquirySection({
  formData,
  setFormData,
}: Props) {

  const { t } = useTranslation();

  const addMember = () => {
    setFormData((prev) => ({
      ...prev,
      boardMembers: [
        ...prev.boardMembers,
        {
          id: crypto.randomUUID(),
          memberName: "",
          designation: "",
        },
      ],
    }));
  };

  const updateMember = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...formData.boardMembers];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      boardMembers: updated,
    }));
  };

  const removeMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      boardMembers:
        prev.boardMembers.filter(
          (_, i) => i !== index
        ),
    }));
  };

  return (
    <div className="space-y-4">

      {formData.boardMembers.map(
        (member, index) => (
          <div
            key={member.id}
            className="border rounded-xl p-4 bg-gray-50"
          >
            <div className="grid md:grid-cols-2 gap-4">

              <FormField label={t("fr104_4.board.memberName")}>
                <InputField
                  value={member.memberName}
                  onChange={(e) =>
                    updateMember(
                      index,
                      "memberName",
                      e.target.value
                    )
                  }
                />
              </FormField>

              <FormField label={t("fr104_4.board.designation")}>
                <InputField
                  value={member.designation}
                  onChange={(e) =>
                    updateMember(
                      index,
                      "designation",
                      e.target.value
                    )
                  }
                />
              </FormField>

            </div>

            <button
              type="button"
              onClick={() =>
                removeMember(index)
              }
              className="mt-4 text-red-500 flex items-center gap-2"
            >
              <Trash2 size={16} />
              {t("fr104_4.board.removeMember")}
            </button>
          </div>
        )
      )}

      <button
        type="button"
        onClick={addMember}
        className="flex items-center gap-2 text-blue-700"
      >
        <Plus size={16} />
        {t("fr104_4.board.addMember")}
      </button>
    </div>
  );
}