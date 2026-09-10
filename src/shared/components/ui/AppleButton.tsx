import React from "react";

export interface AppleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost" | "apple-dark";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const AppleButton: React.FC<AppleButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-[0_1px_2px_rgba(0,113,227,0.3)] dark:bg-[#0A84FF] dark:hover:bg-[#409CFF]";
      case "apple-dark":
        return "bg-[#1D1D1F] hover:bg-[#2C2C2E] text-white shadow-sm dark:bg-[#FFFFFF] dark:text-[#1D1D1F] dark:hover:bg-[#E5E5EA]";
      case "destructive":
        return "bg-[#FF3B30] hover:bg-[#E02E24] text-white shadow-[0_1px_2px_rgba(255,59,48,0.3)] dark:bg-[#FF453A] dark:hover:bg-[#FF6961]";
      case "secondary":
        return "bg-black/[0.05] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.12] text-[#1D1D1F] dark:text-[#F5F5F7] border border-black/[0.04] dark:border-white/[0.06]";
      case "ghost":
        return "bg-transparent hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]";
      default:
        return "";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "h-7 px-3 text-xs rounded-full gap-1.5";
      case "lg":
        return "h-11 px-5 text-sm font-semibold rounded-full gap-2";
      case "md":
      default:
        return "h-9 px-4 text-xs font-medium rounded-full gap-1.5";
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center select-none font-medium tracking-tight transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:opacity-45 disabled:pointer-events-none cursor-pointer ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default AppleButton;
