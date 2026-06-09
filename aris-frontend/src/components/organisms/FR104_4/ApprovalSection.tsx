import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import type { FR104_4FormData } from "@/types/FR104_4_types";

interface Props {
  formData: FR104_4FormData;
  handleChange: (field: keyof FR104_4FormData, value: any) => void;
}

export default function ApprovalSection({
  formData,
  handleChange,
}: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-4">

      <FormField label="Prepared By">
        <InputField
          value={formData.preparedBy}
          onChange={(e) =>
            handleChange("preparedBy", e.target.value)
          }
        />
      </FormField>

      <FormField label="Designation">
        <InputField
          value={formData.preparedDesignation}
          onChange={(e) =>
            handleChange(
              "preparedDesignation",
              e.target.value
            )
          }
        />
      </FormField>

      <FormField label="Approved By">
        <InputField
          value={formData.approvedBy}
          onChange={(e) =>
            handleChange("approvedBy", e.target.value)
          }
        />
      </FormField>

      <FormField label="Approval Date">
        <InputField
          type="date"
          value={formData.approvalDate}
          onChange={(e) =>
            handleChange("approvalDate", e.target.value)
          }
        />
      </FormField>

    </div>
  );
}