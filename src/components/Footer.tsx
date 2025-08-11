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
    <footer className="bg-muted py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          {/* معلومات التواصل */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">معلومات التواصل</h3>
            <div className="space-y-3">
              <Button
                variant="ghost"
                onClick={handleWhatsAppClick}
                className="text-muted-foreground hover:text-primary flex items-center gap-2 w-full justify-center md:justify-start"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span>{settings.whatsapp_number}</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleEmailClick}
                className="text-muted-foreground hover:text-primary flex items-center gap-2 w-full justify-center md:justify-start"
              >
                <Mail className="h-4 w-4 text-primary" />
                <span>{settings.email}</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleLocationClick}
                className="text-muted-foreground hover:text-primary flex items-center gap-2 w-full justify-center md:justify-start"
              >
                <MapPin className="h-4 w-4 text-primary" />
                <span>الموقع الجغرافي</span>
              </Button>
            </div>
          </div>
          
          {/* الشعار */}
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-primary mb-2">{settings.site_name_ar}</h2>
            <p className="text-muted-foreground">{settings.site_name_en}</p>
          </div>
          
          {/* روابط سريعة */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">روابط سريعة</h3>
            <div className="space-y-2">
              <div><Link to="/" className="text-muted-foreground hover:text-primary">الرئيسية</Link></div>
              <div><Link to="/cart" className="text-muted-foreground hover:text-primary">سلة المشتريات</Link></div>
              <div><Link to="/auth" className="text-muted-foreground hover:text-primary">تسجيل الدخول</Link></div>
            </div>
          </div>
        </div>
        
        {/* حقوق النشر */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2025 متجر {settings.site_name_ar}/{settings.site_name_en}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
