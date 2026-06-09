import { InputField } from "@/components/atoms/InputField";
import  type {LostItem , FR104_3Data} from "@/types/form_104_3_types";
import { useTranslation } from "react-i18next";


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
      <h2 className="font-semibold text-lg mb-3">
        {t("fr104_3.itemsLost")}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">
                {t("fr104_3.description")}
              </th>

              <th className="border p-2 text-left">
                {t("fr104_3.quantity")}
              </th>

              <th className="border p-2 text-left">
                {t("fr104_3.unit")}
              </th>

              <th className="border p-2 text-left">
                {t("fr104_3.value")}
              </th>

              <th className="border p-2 text-left">
                {t("fr104_3.action")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">
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
                </td>

                <td className="border p-2">
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
                </td>

                <td className="border p-2">
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
                </td>

                <td className="border p-2">
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
                </td>

                <td className="border p-2">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {t("fr104_3.remove")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {t("fr104_3.addItem")}
      </button>
    </div>
  );
};

export default LostItemsSection;