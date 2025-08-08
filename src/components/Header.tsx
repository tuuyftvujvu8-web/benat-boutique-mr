import React from "react";
import BrandLogo from "@/components/BrandLogo";
import { User2, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-primary text-primary-foreground shadow-sm" role="banner">
      <div className="container relative flex items-center justify-between h-16">
        {/* Icons group (profile, cart) */}
        <div className="flex items-center gap-3">
          <button aria-label="الحساب" className="rounded-md border border-primary-foreground/20 p-2 hover:bg-primary-foreground/10 transition" title="الحساب">
            <User2 className="h-5 w-5" />
          </button>
          <button aria-label="السلة" className="rounded-md border border-primary-foreground/20 p-2 hover:bg-primary-foreground/10 transition" title="السلة">
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>

        {/* Centered brand */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <BrandLogo contrast="onPrimary" />
        </div>

        {/* Spacer to balance layout */}
        <div className="opacity-0 flex items-center gap-3">
          <div className="h-9 w-9" />
          <div className="h-9 w-9" />
        </div>
      </div>

      {/* Search under header */}
      <div className="bg-primary/95 pb-3">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <label htmlFor="site-search" className="sr-only">ابحث</label>
            <Input
              id="site-search"
              type="search"
              placeholder="ابحث عن منتج (ملحف، فساتين، حقائب، عطور)"
              className="bg-background text-foreground placeholder:opacity-70"
              aria-label="ابحث عن منتج"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
