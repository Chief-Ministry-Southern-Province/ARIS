import { useTranslation } from "react-i18next";

type Option = {
  value: string;
  label: string;
};

type SelectFieldProps =
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: Option[];
  };

export function SelectField({
  options,
  className = "",
  ...props
}: SelectFieldProps) {
  const { t } = useTranslation();
  return (
    <select
      {...props}
      className={`
        w-full
        px-3
        py-2.5
        border
        border-gray-300
        rounded-lg
        text-sm
        bg-white
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        ${className}
      `}
    >
      <option value="">{t("common.select")}</option>

      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}