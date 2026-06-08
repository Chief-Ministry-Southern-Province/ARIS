interface FormCardProps {
  title: string;
  children: React.ReactNode;
}

export const FormCard = ({ title, children }: FormCardProps) => (
  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">

    <div className="bg-blue-800 px-6 py-4">
      <h2 className="text-white font-semibold text-lg">
        {title}
      </h2>
    </div>

    <div className="p-6">
      {children}
    </div>

  </div>
);