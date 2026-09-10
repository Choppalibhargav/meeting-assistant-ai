import React from "react";

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md";
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className = "",
  size = "md",
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`inline-flex p-1 bg-black/[0.05] dark:bg-white/[0.08] rounded-xl select-none relative ${className}`}
      role="tablist"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        const sizeStyles =
          size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs";

        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={`relative flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer ${sizeStyles} ${
              isActive
                ? "bg-white dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]"
                : "text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#FFFFFF]"
            }`}
          >
            {option.icon && <span className="flex-shrink-0 text-[1.1em]">{option.icon}</span>}
            <span>{option.label}</span>
            {option.badge !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? "bg-[#0071E3] text-white"
                    : "bg-black/[0.08] dark:bg-white/[0.1] text-[#86868B]"
                }`}
              >
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
