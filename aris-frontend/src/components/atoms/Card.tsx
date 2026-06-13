import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`bg-card text-card-foreground border border-border rounded-xl shadow-sm ${className || ""}`}>
      {children}
    </div>
  );
}