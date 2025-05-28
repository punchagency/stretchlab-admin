import { useState } from "react";
import type { SvgIconName } from "@/types";
import { SvgIcon } from "./SvgIcon";

type Props = {
  label?: string;
  icon?: SvgIconName;
  type: string;
  placeholder: string;
  value: string;
  name?: string;
  checking?: boolean;
  error?: string;
  success?: string;
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
  ...inputProps
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <label className="flex items-center mb-1 justify-between">
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
        className={`flex items-center gap-3 border border-grey-3 ${
          inputProps.className
        } ${inputProps.className?.includes("rounded") ? "" : "rounded-2xl"} ${
          inputProps.className?.includes("py-") ? "" : "py-4"
        } px-3`}
      >
        {icon && <SvgIcon name={icon} width={18} height={15} />}
        <input
          name={name}
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...inputProps}
          className="outline-none bg-transparent flex-1 placeholder:text-grey-2 text-base"
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
    </div>
  );
};
