import React from "react";
import { ShoppingCart, User, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-banat-pink text-primary-foreground shadow-soft" role="banner">
      <div className="container relative flex items-center justify-between h-16">
        {/* السلة في أقصى اليسار */}
        <div className="flex items-center gap-3">
          <Link to="/cart" aria-label="cart" title="cart" className="p-2">
            <ShoppingCart className="w-6 h-6 text-primary-foreground" />
          </Link>
        </div>

        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="flex flex-col items-center leading-none">
            <span className="text-2xl font-bold text-primary-foreground">بــــــنات</span>
            <span className="text-sm font-light text-primary-foreground/90 tracking-wide">BENAT</span>
          </div>
        </div>

        {/* الحساب في أقصى اليمين */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20 p-2"
            onClick={() => navigate("/auth")}
            aria-label="account"
            title="account"
          >
            <User className="w-6 h-6 text-primary-foreground" />
          </Button>
        </div>
      </div>

      <div className="bg-primary-foreground/10 backdrop-blur-sm">
        <div className="container py-3">
          <div className="mx-auto w-full max-w-md relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/70 pointer-events-none" />
            <input
              type="search"
              placeholder="ابحث عن منتج"
              aria-label="search product"
              className="w-full rounded-md pr-12 pl-4 py-2 bg-primary-foreground/20 border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/70 focus:outline-none focus:bg-primary-foreground/30 transition"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;