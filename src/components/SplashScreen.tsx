import React from "react";
import BrandLogo from "@/components/BrandLogo";

interface SplashScreenProps {
  visible: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ visible }) => {
  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-primary transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <BrandLogo contrast="onPrimary" className="scale-100 animate-in fade-in-0 zoom-in-95 duration-700" />
    </div>
  );
};

export default SplashScreen;
