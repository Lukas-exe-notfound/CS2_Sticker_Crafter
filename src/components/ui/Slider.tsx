interface SliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

export function Slider({ label, value, min = 0, max = 100, step = 1, onChange }: SliderProps) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-forge-muted">
        {label}
        <span className="text-forge-text">{value}</span>
      </span>
      <input
        aria-label={label}
        className="h-2 w-full accent-forge-cyan"
        max={max}
        min={min}
        step={step}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
