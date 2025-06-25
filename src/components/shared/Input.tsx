import { useState } from "react";
import type { SvgIconName } from "@/types";
import { SvgIcon } from "./SvgIcon";

type Props = {
  label?: string;
  icon?: SvgIconName;
  type: string;
  placeholder?: string;
  value: string;
  name?: string;
  checking?: boolean;
  error?: string;
  success?: string;
  labelStyle?: string;
  helperText?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({
  label,
  icon,
  type,
  placeholder,
  value,
  onChange,
  name,
  error,
  checking,
  success,
  helperText,
  labelStyle,
  ...inputProps
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <label className={`flex items-center mb-1 justify-between ${labelStyle}nd ${labelStyle}`}>
        {label}
        {(checking || error || success) && (
          <span
            className={`text-sm ${
              checking
                ? "text-yellow-500 animate-pulse italic"
                : error
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {checking ? "checking availability..." : error || success}
          </span>
        )}
      </label>
      <div
        className={`flex items-center gap-3 border border-border ${
          inputProps.className
        } ${inputProps.className?.includes("rounded") ? "" : "rounded-2xl"} ${
          inputProps.className?.includes("py-") ? "" : "py-4"
        } px-3 transition-colors`}
      >
        {icon && <SvgIcon name={icon} width={18} height={15} />}
        <input
          name={name}
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...inputProps}
          className="outline-none bg-transparent flex-1 disabled:opacity-50 disabled:cursor-nor:text-muted-foreground text-base placeholder:text-sm text-foreground"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="ml-auto"
          >
            <SvgIcon name="eye" />
          </button>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-2">{helperText}</p>
    </div>
  );
};
