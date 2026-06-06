interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const SelectField = ({
  children,
  className = "",
  ...props
}: SelectFieldProps) => {
  return (
    <select
      {...props}
      className={`
        w-full px-3 py-2.5
        border border-gray-300
        rounded-lg text-sm
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-transparent
        bg-white
        ${className}
      `}
    >
      {children}
    </select>
  );
};