import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "blue" | "green" | "red" | "orange" | "purple" | "gray";
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "gray",
  size = "sm",
  dot = false,
  className = "",
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "blue":
        return {
          wrapper: "bg-[#0071E3]/10 text-[#0071E3] dark:bg-[#0A84FF]/20 dark:text-[#0A84FF]",
          dot: "bg-[#0071E3] dark:bg-[#0A84FF]",
        };
      case "green":
        return {
          wrapper: "bg-[#34C759]/10 text-[#248A3D] dark:bg-[#30D158]/20 dark:text-[#30D158]",
          dot: "bg-[#34C759] dark:bg-[#30D158]",
        };
      case "red":
        return {
          wrapper: "bg-[#FF3B30]/10 text-[#D70015] dark:bg-[#FF453A]/20 dark:text-[#FF453A]",
          dot: "bg-[#FF3B30] dark:bg-[#FF453A]",
        };
      case "orange":
        return {
          wrapper: "bg-[#FF9500]/10 text-[#C93400] dark:bg-[#FF9F0A]/20 dark:text-[#FF9F0A]",
          dot: "bg-[#FF9500] dark:bg-[#FF9F0A]",
        };
      case "purple":
        return {
          wrapper: "bg-[#AF52DE]/10 text-[#8944AB] dark:bg-[#BF5AF2]/20 dark:text-[#BF5AF2]",
          dot: "bg-[#AF52DE] dark:bg-[#BF5AF2]",
        };
      case "gray":
      default:
        return {
          wrapper: "bg-black/[0.05] text-[#1D1D1F] dark:bg-white/[0.08] dark:text-[#F5F5F7]",
          dot: "bg-[#86868B]",
        };
    }
  };

  const { wrapper, dot: dotColor } = getVariantClasses();
  const sizeClasses = size === "md" ? "text-xs px-2.5 py-1" : "text-[10px] px-2 py-0.5";

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full select-none ${wrapper} ${sizeClasses} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />}
      {children}
    </span>
  );
};

export default Badge;
