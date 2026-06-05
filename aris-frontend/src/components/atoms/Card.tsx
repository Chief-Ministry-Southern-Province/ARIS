import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-xl shadow-sm">
      {children}
    </div>
  );
}