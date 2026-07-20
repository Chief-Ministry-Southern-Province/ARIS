import { useTranslation } from "react-i18next";
import { FormCard } from "@/components/molecules/FormCard";
import type { FR109FormData } from "@/types/FR109.type";

interface Props {
  data: FR109FormData;
  handleChange: (field: keyof FR109FormData, value: string) => void;
  Field: React.ComponentType<any>;
}

export default function WriteOffRegisterSection({data,handleChange,Field,}: Props) 
{
  const { t } = useTranslation();

  return (
    <FormCard
      part={t("fr109.parts.j")}
      title={t("fr109.sections.writeOffNotedIn")}
    >
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Field
          label={t("fr109.fields.stockBookFolio")}
          value={data.stockBookFolio}
          onChange={(v: string) =>
            handleChange("stockBookFolio", v)
          }
        />

        <Field
          label={t("fr109.fields.inventoryBookFolio")}
          value={data.inventoryBookFolio}
          onChange={(v: string) =>
            handleChange("inventoryBookFolio", v)
          }
        />

        <Field
          label={t("fr109.fields.fixedAssetsRegisterFolio")}
          value={data.fixedAssetsRegisterFolio}
          onChange={(v: string) =>
            handleChange("fixedAssetsRegisterFolio", v)
          }
        />

        <Field
          label={t("fr109.fields.ledgerFolio")}
          value={data.ledgerFolio}
          onChange={(v: string) =>
            handleChange("ledgerFolio", v)
          }
        />
      </div>
    </FormCard>
  );
}