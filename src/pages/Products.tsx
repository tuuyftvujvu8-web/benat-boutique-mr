import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  price_mru: number;
  short_description?: string;
  rating: number;
  rating_count: number;
  product_images: { url: string; sort_order: number }[];
}

interface Category {
  id: string;
  name: string;
  image_url?: string;
}

const Products = () => {
  const { categorySlug } = useParams();
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category
        const { data: categoryData } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', categorySlug)
          .single();
        
        setCategory(categoryData);

        // Fetch products in this category
        if (categoryData) {
          const { data: productsData } = await supabase
            .from('products')
            .select(`
              id,
              name,
              price_mru,
              short_description,
              rating,
              rating_count,
              product_images(url, sort_order)
            `)
            .eq('category_id', categoryData.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          setProducts(productsData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchData();
    }
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-8">
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted rounded-lg" />
                <div className="h-4 bg-muted rounded mt-2" />
                <div className="h-3 bg-muted rounded mt-1 w-1/2" />
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-8 text-center">
          <h1 className="text-xl font-bold">الفئة غير موجودة</h1>
          <Link to="/" className="text-banat-pink underline">العودة للصفحة الرئيسية</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{category.name}</h1>
          {isAdmin && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
                تعديل الفئة
              </Button>
              <Button size="sm">
                + إضافة منتج
              </Button>
            </div>
          )}
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">لا توجد منتجات في هذه الفئة حالياً</p>
            {isAdmin && (
              <Button className="mt-4">+ إضافة أول منتج</Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Products;