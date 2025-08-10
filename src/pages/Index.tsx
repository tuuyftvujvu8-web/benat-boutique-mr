import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import Footer from "@/components/Footer";
import VideoSection from "@/components/VideoSection";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

interface Category {
  id: string;
  name: string;
  image_url?: string;
  slug: string;
}

const Index = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .order('position', { ascending: true });
        
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
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
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded-lg" />
                  <div className="mt-2 h-4 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {categories.map((c) => (
                <CategoryCard 
                  key={c.id} 
                  title={c.name} 
                  imageUrl={c.image_url || ''} 
                  slug={c.slug}
                />
              ))}
            </div>
          )}
        </section>
        <VideoSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
