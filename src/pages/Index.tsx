import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import Footer from "@/components/Footer";
import VideoSection from "@/components/VideoSection";
import React from "react";

const categories = [
  {
    title: "ملحف",
    imageUrl: "https://i.postimg.cc/DzDqjCwx/alalalia-white-100-002-039-alt3-sq-gy-2000x2000.jpg",
  },
  {
    title: "حقائب",
    imageUrl: "https://i.postimg.cc/Hk605WDD/attar-bottle-manufacturer-300x300.jpg",
  },
  {
    title: "فساتين",
    imageUrl: "https://i.postimg.cc/CxhHzB2s/FB-IMG-1674512139138-1-1.jpg",
  },
  {
    title: "عطور",
    imageUrl: "https://i.postimg.cc/mrhYSxBc/IMG-20250612-WA0019.jpg",
  },
];

const Index = () => {
  React.useEffect(() => {
    // Structured data
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'بنات Benat',
      url: typeof window !== 'undefined' ? window.location.origin : '',
      sameAs: [
        'https://wa.me/22249055137',
        'mailto:moubarakouhoussein@gmail.com',
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'MR',
        addressLocality: 'Mauritania'
      }
    };
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.text = JSON.stringify(data);
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  return (
    <>
      <Header />
      <main className="container py-8">
        <h1 className="sr-only">بنات Benat - متجر ملابس نسائية وحقائب وعطور في موريتانيا</h1>
        <section aria-label="الفئات الرئيسية">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((c) => (
              <CategoryCard key={c.title} title={c.title} imageUrl={c.imageUrl} />
            ))}
          </div>
        </section>
        <VideoSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
