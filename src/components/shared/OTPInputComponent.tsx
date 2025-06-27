import React from "react";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";

interface OTPInputComponentProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const OTPInputComponent: React.FC<OTPInputComponentProps> = ({
  value,
  onChange,
  error,
  label = "Enter Code",
  disabled = false,
  size = "md",
  className = "",
}) => {
  const sizeConfig = {
    sm: {
      width: "w-10",
      height: "h-10",
      text: "text-lg",
      gap: "gap-2",
      caretHeight: "h-6",
    },
    md: {
      width: "w-12", 
      height: "h-12",
      text: "text-xl",
      gap: "gap-2",
      caretHeight: "h-7",
    },
    lg: {
      width: "w-14",
      height: "h-14", 
      text: "text-2xl",
      gap: "gap-3",
      caretHeight: "h-8",
    },
  };

  const config = sizeConfig[size];

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-bold text-gray-700 text-center">
        {label}
      </label>
      <div>
        <OTPInput
          maxLength={6}
          value={value}
          onChange={onChange}
          pattern={REGEXP_ONLY_DIGITS}
          disabled={disabled}
          containerClassName={`group flex items-center justify-between ${config.gap}`}
          render={({ slots }) => (
            <>
              {slots.map((slot, idx) => (
                <div
                  key={idx}
                  className={`relative ${config.width} ${config.height} ${config.text} font-semibold border-2 border-gray-300 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:border-primary-base/50 group-focus-within:border-primary-base ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{
                    borderColor: slot.isActive ? '#368591' : undefined,
                    backgroundColor: slot.char ? 'rgba(54, 133, 145, 0.05)' : undefined,
                  }}
                >
                  {slot.char !== null && (
                    <div className="text-gray-900">
                      {slot.char}
                    </div>
                  )}
                  {slot.hasFakeCaret && !disabled && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-0.5 ${config.caretHeight} bg-primary-base animate-pulse`} />
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
    </div>
  );
}; 