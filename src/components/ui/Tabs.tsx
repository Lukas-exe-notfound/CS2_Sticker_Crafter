interface TabsProps<T extends string> {
  value: T;
  options: T[];
  onChange: (value: T) => void;
}

export function Tabs<T extends string>({ value, options, onChange }: TabsProps<T>) {
  return (
    <div className="flex rounded-md border border-white/10 bg-black/20 p-1">
      {options.map((option) => (
        <button
          key={option}
          className={`flex-1 rounded px-3 py-2 text-sm font-semibold transition ${value === option ? "bg-forge-cyan text-slate-950" : "text-forge-muted hover:text-white"}`}
          onClick={() => onChange(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
