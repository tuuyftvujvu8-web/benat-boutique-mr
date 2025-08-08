import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t bg-card">
      <div className="container py-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold mb-2">تواصل معنا</h3>
          <ul className="space-y-2 text-sm">
            <li>
              واتساب: {" "}
              <a className="text-primary underline hover:opacity-80" href="https://wa.me/22249055137" target="_blank" rel="noopener noreferrer">+222 49055137</a>
            </li>
            <li>
              البريد الإلكتروني: {" "}
              <a className="text-primary underline hover:opacity-80" href="mailto:moubarakouhoussein@gmail.com">moubarakouhoussein@gmail.com</a>
            </li>
            <li>
              الموقع الجغرافي: {" "}
              <a className="text-primary underline hover:opacity-80" href="https://maps.app.goo.gl/vE3k4Ts1shPzQmNd7" target="_blank" rel="noopener noreferrer">عرض على الخرائط</a>
            </li>
          </ul>
        </div>
        <div className="sm:col-span-2 lg:col-span-2 flex items-end justify-center lg:justify-end">
          <p className="text-xs text-muted-foreground">© 2025 متجر بنات/benat. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
