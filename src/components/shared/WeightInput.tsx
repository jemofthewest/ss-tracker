interface WeightInputProps {
  value: number;
  onChange: (value: number) => void;
  increment?: number;
  label?: string;
  min?: number;
}

export function WeightInput({ value, onChange, increment = 5, label, min = 0 }: WeightInputProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      {label && <label className="text-sm text-gray-500 font-medium">{label}</label>}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - increment))}
          className="w-12 h-12 rounded-full bg-gray-200 text-xl font-bold text-gray-700 active:bg-gray-300 transition-colors flex items-center justify-center"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v) && v >= min) onChange(v);
          }}
          className="w-24 text-center text-2xl font-bold border border-gray-300 rounded-lg py-2 bg-white"
        />
        <button
          onClick={() => onChange(value + increment)}
          className="w-12 h-12 rounded-full bg-blue-500 text-xl font-bold text-white active:bg-blue-600 transition-colors flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  );
}
