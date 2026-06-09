import { Button } from "@/components/atoms/Button";
import { useTranslation } from "react-i18next";

interface User {
  id: string;
  name: string;
  designation: string;
  role: "OFFICER" | "HEAD" | "SECRETARY";
  signatureUrl?: string;
}

interface Props {
  currentUser: User;
  formData: any;
  handleChange: (field: string, value: any) => void;
}

export default function ApprovalSection({
  currentUser,
  formData,
  handleChange,
}: Props) {
  const { t } = useTranslation();

  const signSection = (
    signatureField: string,
    dateField: string
  ) => {
    handleChange(
      signatureField,
      currentUser.signatureUrl
    );

    handleChange(
      dateField,
      new Date().toISOString().split("T")[0]
    );
  };

  return (
    <div className="space-y-6">

      {/* Prepared By */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">
          {t("fr104_4.approval.preparedSection")}
        </h3>

        <div className="space-y-2">
          <p>
            <strong>{t("fr104_4.approval.name")}:</strong>{" "}
            {currentUser.role === "OFFICER"
              ? currentUser.name
              : formData.preparedBy}
          </p>

          <p>
            <strong>{t("fr104_4.approval.designation")}:</strong>{" "}
            {currentUser.role === "OFFICER"
              ? currentUser.designation
              : formData.preparedDesignation}
          </p>

          {formData.preparedSignature && (
            <img
              src={formData.preparedSignature}
              alt="Prepared Signature"
              className="h-16 border rounded"
            />
          )}

          {currentUser.role === "OFFICER" &&
            !formData.preparedSignature && (
              <Button
                type="button"
                onClick={() =>
                  signSection(
                    "preparedSignature",
                    "preparedDate"
                  )
                }
              >
                {t("fr104_4.approval.signature")}
              </Button>
            )}
        </div>
      </div>

      {/* Head Approval */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">
          {t("fr104_4.approval.headSection")}
        </h3>

        {formData.headSignature && (
          <img
            src={formData.headSignature}
            alt="Head Signature"
            className="h-16 border rounded"
          />
        )}

        {currentUser.role === "HEAD" &&
          !formData.headSignature && (
            <Button
              type="button"
              onClick={() =>
                signSection(
                  "headSignature",
                  "headApprovalDate"
                )
              }
            >
              {t("fr104_4.approval.signature")}
            </Button>
          )}
      </div>

      {/* Secretary Approval */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">
          {t("fr104_4.approval.secretarySection")}
        </h3>

        {formData.secretarySignature && (
          <img
            src={formData.secretarySignature}
            alt="Secretary Signature"
            className="h-16 border rounded"
          />
        )}

        {currentUser.role === "SECRETARY" &&
          !formData.secretarySignature && (
            <Button
              type="button"
              onClick={() =>
                signSection(
                  "secretarySignature",
                  "secretaryApprovalDate"
                )
              }
            >
              {t("fr104_4.approval.signature")}
            </Button>
          )}
      </div>

    </div>
  );
}