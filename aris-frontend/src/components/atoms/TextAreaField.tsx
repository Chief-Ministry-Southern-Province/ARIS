type TextAreaFieldProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextAreaField = ({
  className = "",
  ...props
}: TextAreaFieldProps) => {
  return (
    <textarea
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