import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}

const Logo: React.FC<LogoProps> = ({ size = "md", variant = "dark" }) => {
  const sizeClass = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const colorClass = {
    light: "text-white",
    dark: "text-gray-800",
  };

  return (
    <div className={`font-bold ${sizeClass[size]} ${colorClass[variant]}`}>
      <span>TimeWise</span>
    </div>
  );
};

export default Logo;
