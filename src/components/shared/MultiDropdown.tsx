import { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label?: string;
  value?: string;
  options: string[] | FilterOption[];
  onChange?: (value: string) => void;
  className?: string;
  showLabel?: boolean;
  showSearch?: boolean;

  // 🆕 optional multi-select props
  multiSelect?: boolean;
  selectedValues?: string[];
  onMultiChange?: (values: string[]) => void;
}

export const MultiSelectDropdown = ({
  label,
  value = "",
  options,
  onChange,
  className = "",
  showLabel = true,
  showSearch = false,
  multiSelect = false,
  selectedValues = [],
  onMultiChange,
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedOptions: FilterOption[] = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option
  );

  const filteredOptions = showSearch && searchTerm
    ? normalizedOptions.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : normalizedOptions;

  const displayValue = multiSelect
    ? selectedValues.length > 0
      ? selectedValues.join(", ")
      : "Filter By Opportunities"
    : normalizedOptions.find((o) => o.value === value)?.label || "Select...";

  const toggleOption = (optionValue: string) => {
    if (!multiSelect) {
      onChange?.(optionValue);
      setIsOpen(false);
    } else {
      let updated = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onMultiChange?.(updated);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiSelect) {
      onMultiChange?.([]);
    } else {
      onChange?.("");
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {showLabel && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-3 py-3.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-base focus:border-primary-base transition-colors"
        >
          <span className="truncate pr-2 capitalize">{displayValue}</span>
          <div className="flex items-center gap-1">
            {((multiSelect && selectedValues.length > 0) || (!multiSelect && value)) && (
              <X
                className="h-4 w-4 text-gray-400 hover:text-gray-600"
                onClick={handleClear}
              />
            )}
            <ChevronDown
              className={`h-4 w-4 flex-shrink-0 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              <div className="p-2">
                {showSearch && (
                  <div className="relative mb-2">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-base focus:border-primary-base"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}

                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => {
                    const selected = multiSelect
                      ? selectedValues.includes(option.value)
                      : option.value === value;

                    return (
                      <button
                        key={index}
                        onClick={() => toggleOption(option.value)}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded-sm capitalize transition-colors ${
                          selected
                            ? "bg-primary-50 text-primary-base"
                            : "text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {multiSelect && (
                          <input
                            type="checkbox"
                            checked={selected}
                            readOnly
                            className="h-4 w-4 accent-primary-base"
                          />
                        )}
                        <span>{option.label}</span>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 text-center">
                    No options found
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
