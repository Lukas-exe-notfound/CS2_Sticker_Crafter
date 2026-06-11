import { Hammer, Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

const links = [
  ["Home", "/"],
  ["Craft Editor", "/craft"],
  ["Stickers", "/stickers"],
  ["Charms", "/charms"],
  ["Saved Crafts", "/saved"],
  ["Compare", "/compare"],
];

export function TopNav() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-forge-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1720px] items-center gap-4 px-4 py-3">
        <button className="flex items-center gap-2 text-left" onClick={() => navigate("/")} type="button">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-gradient-to-br from-forge-purple to-forge-cyan">
            <Hammer className="h-5 w-5 text-white" />
          </span>
          <span>
            <span className="block font-display text-lg font-extrabold leading-tight">StickerForge CS2</span>
            <span className="block text-xs text-forge-muted">Craft preview studio</span>
          </span>
        </button>
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map(([label, href]) => (
            <NavLink
              key={href}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-semibold transition ${isActive ? "bg-white/10 text-white" : "text-forge-muted hover:text-white"}`
              }
              to={href}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <label className="ml-auto hidden min-w-64 items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-forge-muted" />
          <input className="w-full bg-transparent text-sm outline-none placeholder:text-forge-muted" placeholder="Search skins or stickers" />
        </label>
        <Button variant="primary" onClick={() => navigate("/craft")}>
          Start Crafting
        </Button>
      </div>
    </header>
  );
}
