import React from "react";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
  visible: boolean;
}

const SplashScreen = ({ visible }: SplashScreenProps) => {
  if (!visible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      "bg-gradient-to-br from-primary to-primary/80",
      "animate-fade-in"
    )}>
      <div className="text-center text-white">
        <div className="mb-8 animate-scale-in">
          <div className="text-6xl mb-4">🇲🇷</div>
          <h1 className="text-4xl font-bold mb-2">ألغاز موريتانيا</h1>
          <p className="text-xl opacity-90">اختبر معرفتك بثقافة وتاريخ موريتانيا</p>
        </div>
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;