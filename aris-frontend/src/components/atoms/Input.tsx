import type{ InputHTMLAttributes } from "react";

export function Input(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      className="
        w-full
        px-3
        py-2
        rounded-lg
        border
        border-border
        bg-input-background
        text-foreground
        focus:ring-2
        focus:ring-ring
        outline-none
      "
      {...props}
    />
  );
}