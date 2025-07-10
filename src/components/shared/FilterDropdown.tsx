import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FilterDropdownProps {
  label?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
  showLabel?: boolean;
}

export const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
  className = "",
  showLabel = true,
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {showLabel && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-base focus:border-primary-base "
        >
          <span className="truncate">{value}</span>
          <ChevronDown 
            className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto p-2">
              <div className="py-1">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm  focus:outline-none focus:bg-gray-100 rounded-sm ${
                      option === value ? 'bg-primary-base text-white' : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 