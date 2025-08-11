import React from 'react';
import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Footer = () => {
  const settings = {
    whatsapp_number: '+222 49262003',
    email: 'noura.el.houssein@gmail.com',
    location_url: 'https://maps.app.goo.gl/vE3k4Ts1shPzQmNd7',
    site_name_ar: 'بنات',
    site_name_en: 'benat'
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`, "_blank");
  };

  const handleEmailClick = () => {
    window.open(`mailto:${settings.email}`, "_blank");
  };

  const handleLocationClick = () => {
    window.open(settings.location_url, "_blank");
  };

  return (
    <footer className="bg-banat-pink text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">معلومات التواصل</h3>
            <div className="flex flex-col items-center md:items-start gap-3">
              <Button
                variant="ghost"
                onClick={handleWhatsAppClick}
                className="text-white hover:bg-white/20 flex items-center gap-2 w-full md:w-auto justify-center md:justify-start"
              >
                <Phone className="h-5 w-5" />
                <span>{settings.whatsapp_number}</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleEmailClick}
                className="text-white hover:bg-white/20 flex items-center gap-2 w-full md:w-auto justify-center md:justify-start"
              >
                <Mail className="h-5 w-5" />
                <span className="text-sm">{settings.email}</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleLocationClick}
                className="text-white hover:bg-white/20 flex items-center gap-2 w-full md:w-auto justify-center md:justify-start"
              >
                <MapPin className="h-5 w-5" />
                <span>الموقع الجغرافي</span>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-2">{settings.site_name_ar}</h2>
            <p>{settings.site_name_en}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-white hover:underline">الرئيسية</Link>
              <Link to="/cart" className="text-white hover:underline">سلة المشتريات</Link>
              <Link to="/auth" className="text-white hover:underline">تسجيل الدخول</Link>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 pt-8 border-t border-white/20">
          <p className="text-white/80">
            © 2025 متجر {settings.site_name_ar}/{settings.site_name_en}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
