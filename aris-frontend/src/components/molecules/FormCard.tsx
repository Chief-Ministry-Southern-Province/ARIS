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
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="bg-linear-to-r from-blue-800 to-blue-700 px-6 py-4 dark:from-blue-950 dark:to-blue-900">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/25 dark:bg-white/10">
            {part}
          </span>

          <h2 className="text-white text-lg font-semibold">
            {title}
          </h2>
        </div>
      </div>

      <div className="p-6 text-slate-900 dark:text-slate-100">{children}</div>
    </section>
  );
};
