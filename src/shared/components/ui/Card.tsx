import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "inset" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  padding = "md",
  className = "",
  ...props
}) => {
  const getPaddingClass = () => {
    switch (padding) {
      case "none":
        return "";
      case "sm":
        return "p-3";
      case "lg":
        return "p-5";
      case "md":
      default:
        return "p-4";
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case "inset":
        return "bg-black/[0.025] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06]";
      case "interactive":
        return "bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] dark:hover:border-white/[0.14] transition-all duration-200 cursor-pointer active:scale-[0.995]";
      case "default":
      default:
        return "bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)]";
    }
  };

  return (
    <div
      className={`rounded-2xl ${getVariantClass()} ${getPaddingClass()} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
