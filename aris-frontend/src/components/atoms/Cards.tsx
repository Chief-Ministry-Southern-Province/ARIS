import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Card({ children }: Props) {
  return (
    <div
      className="
      bg-card
      text-card-foreground
      border
      border-border
      rounded-xl
      shadow-sm
      p-5
    "
    >
      {children}
    </div>
  );
}