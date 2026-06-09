import type { ReactNode } from "react";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-white/10 bg-forge-panel/85 ${className}`}>{children}</section>;
}
