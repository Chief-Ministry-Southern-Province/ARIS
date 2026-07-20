import React from "react";

interface CheckboxProps {
  id?: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export const Checkbox = ({
  id,
  name,
  checked,
  onChange,
  disabled = false,
  className = "",
}: CheckboxProps) => {
  return (
    <input
      id={id ?? name}
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={`h-4 w-4 rounded border-gray-300text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
    />
  );
};