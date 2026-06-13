type InputFieldProps =
  React.InputHTMLAttributes<HTMLInputElement>;

export const InputField = ({
  className = "",
  ...props
}: InputFieldProps) => {
  return (
    <input
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
    />
  );
};