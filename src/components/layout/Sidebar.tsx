import type { ReactNode } from "react";

export function Sidebar({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <aside className={`min-h-0 overflow-auto border-white/10 bg-forge-panel/80 ${className}`}>{children}</aside>;
}
