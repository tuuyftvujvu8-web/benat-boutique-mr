import React from "react";

interface BrandLogoProps {
  className?: string;
  contrast?: "default" | "onPrimary";
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className = "", contrast = "default" }) => {
  const textClass = contrast === "onPrimary" ? "text-primary-foreground" : "text-foreground";
  return (
    <div className={`inline-flex flex-col items-center ${className}`} aria-label="شعار بـــــــنات Benat">
      <span className={`font-extrabold leading-none tracking-wide ${textClass} text-4xl sm:text-5xl`}>
        بـــــــنات
      </span>
      <span className={`mt-1 text-xs sm:text-sm opacity-90 ${textClass}`}>Benat</span>
      <span className={`mt-1 h-0.5 w-24 rounded-full ${contrast === "onPrimary" ? "bg-primary-foreground/70" : "bg-foreground/50"}`} />
    </div>
  );
};

export default BrandLogo;
