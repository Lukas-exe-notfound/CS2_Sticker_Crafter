import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
}

export function Button({ className = "", variant = "secondary", icon, children, ...props }: ButtonProps) {
  const styles = {
    primary: "bg-forge-purple text-white hover:bg-violet-500",
    secondary: "glass text-forge-text hover:border-cyan-400/60 hover:bg-white/10",
    ghost: "text-forge-muted hover:bg-white/8 hover:text-white",
    danger: "bg-red-500/15 text-red-200 hover:bg-red-500/25",
  };
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${styles[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
