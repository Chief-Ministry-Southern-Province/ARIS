import React from "react";

interface FormCardProps {
  title: string;
  part?: string;
  children: React.ReactNode;
}

export const FormCard = ({
  title,
  part,
  children,
}: FormCardProps) => {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-linear-to-r from-blue-800 to-blue-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="bg-white text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
            {part}
          </span>

          <h2 className="text-white text-lg font-semibold">
            {title}
          </h2>
        </div>
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
};