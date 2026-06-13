import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger";
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
        {
          "bg-primary text-primary-foreground hover:opacity-90":
            variant === "primary",

          "bg-secondary text-secondary-foreground":
            variant === "secondary",

          "bg-success text-white":
            variant === "success",

          "bg-destructive text-white":
            variant === "danger",
        },
        className
      )}
      {...props}
    />
  );
}