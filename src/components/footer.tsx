import { MapPin, Phone, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";


const Footer = () => {

  const handleWhatsAppClick = () => {

    window.open("https://wa.me/22249262003", "_blank");

  };


  const handleEmailClick = () => {

    window.open("mailto:noura.el.houssein@gmail.com", "_blank");

  };


  const handleLocationClick = () => {

    window.open("https://maps.app.goo.gl/vE3k4Ts1shPzQmNd7", "_blank");

  };


  return (

    <footer className="bg-banat-pink text-white py-8 mt-16">

      <div className="container mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

          {/* WhatsApp */}

          <div className="space-y-2">

            <Button

              variant="ghost"

              onClick={handleWhatsAppClick}

              className="text-white hover:bg-white/20 flex items-center gap-2 mx-auto"

            >

              <Phone className="h-5 w-5" />

              <span>+222 49262003</span>

            </Button>

          </div>


          {/* Email */}

          <div className="space-y-2">

            <Button

              variant="ghost"

              onClick={handleEmailClick}

              className="text-white hover:bg-white/20 flex items-center gap-2 mx-auto"

            >

              <Mail className="h-5 w-5" />

              <span className="text-sm">nour.el.houssein@gmail.com</span>

            </Button>

          </div>


          {/* Location */}

          <div className="space-y-2">

            <Button

              variant="ghost"

              onClick={handleLocationClick}

              className="text-white hover:bg-white/20 flex items-center gap-2 mx-auto"

            >

              <MapPin className="h-5 w-5" />

              <span>الموقع الجغرافي</span>

            </Button>

          </div>

        </div>


        {/* Copyright */}

        <div className="text-center mt-8 pt-6 border-t border-white/20">

          <p className="text-white/80">

            © 2025 متجر بنات/benat. جميع الحقوق محفوظة.

          </p>

        </div>

      </div>

    </footer>

  );

};


export default Footer;
