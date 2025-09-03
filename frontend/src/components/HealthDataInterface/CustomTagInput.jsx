import React from 'react';

const CustomTagInput = ({ 
  isOpen, 
  value, 
  placeholder, 
  onChange, 
  onAdd, 
  onCancel, 
  buttonColor = 'emerald' 
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    emerald: 'bg-emerald-600 border-emerald-500 hover:bg-emerald-700',
    green: 'bg-green-600 border-green-500 hover:bg-green-700',
    red: 'bg-red-600 border-red-500 hover:bg-red-700'
  };

  return (
    <div className="mt-2 flex items-center gap-2">
      <input
        type="text"
        className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-white w-48 focus:border-emerald-500 focus:outline-none text-sm placeholder-zinc-500 hover:border-zinc-600"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button
        type="button"
        className={`px-3 py-1.5 text-sm rounded-xl border text-white transition-colors ${colorClasses[buttonColor]}`}
        onClick={onAdd}
      >
        Add
      </button>
      <button
        type="button"
        className="px-3 py-1.5 text-sm rounded-xl border bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600 transition-colors"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
};

export default CustomTagInput;
