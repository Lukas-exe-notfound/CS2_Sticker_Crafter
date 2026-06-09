interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function FilterDropdown({ label, value, options, onChange }: FilterDropdownProps) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-bold uppercase text-forge-muted">{label}</span>
      <select
        className="w-full rounded-md border border-white/10 bg-forge-panel2 px-3 py-2 text-sm text-forge-text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
