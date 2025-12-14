'use client'

import { Button } from "@/components/ui"
import { useState } from "react";
import { FaAngleDown } from "react-icons/fa6"; 


export interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  onSelect: (value: string) => void;
  selectedValue: string;
}


export default function FilterDropdown({
  label,
  options,
  onSelect,
  selectedValue,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const displayLabel = selectedValue
    ? options.find((opt) => opt.value === selectedValue)?.label
    : `Par ${label}`;

  return (
    <div className="relative inline-block text-left w-full sm:w-auto">
      <Button
        type="button"
        variant="secondary" 
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between items-center px-4 py-2 border border-gray-300 rounded-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-VioletC focus:ring-offset-2 transition duration-150 ease-in-out"
      >
       <div className="flex flex-row items-center">
            <span className="truncate">{displayLabel}</span>
            <FaAngleDown 
            className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
            />
       </div>
      </Button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto">
          <div className="py-1">
            <button
              onClick={() => handleSelect("")}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Tous les {label}
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  selectedValue === option.value
                    ? "bg-VioletC text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
