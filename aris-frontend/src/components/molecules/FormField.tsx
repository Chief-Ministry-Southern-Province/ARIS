type FormFieldProps = {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
};

export const FormField = ({
  label,
  children,
  required,
  error,
}: FormFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};