import type { ReactNode } from "react";
import { TopNav } from "./TopNav";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-forge-text">
      <TopNav />
      <main>{children}</main>
      <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-forge-muted">
        StickerForge CS2 is a fan-made preview tool and is not affiliated with Valve. Prices are estimates. This website does not sell skins, stickers or gambling services.
      </footer>
    </div>
  );
}
