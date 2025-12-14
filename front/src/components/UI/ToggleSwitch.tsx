import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
  className?: string;
}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  className = ''
}: ToggleSwitchProps) {
  return (
    <div className={`flex items-center justify-between py-3 border-b border-purple-dark/5 last:border-b-0 ${className}`}>
      <div className="flex-1 pr-3">
        <p className="text-navy-deep text-base sm:text-lg font-medium mb-1">{label}</p>
        <p className="text-navy-deep/40 text-xs sm:text-sm">{description}</p>
      </div>
      
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-purple-dark/40 border-2 border-purple-dark/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2C0E40] peer-checked:border-[#2C0E40] peer-checked:after:bg-white"></div>
      </label>
    </div>
  );
}