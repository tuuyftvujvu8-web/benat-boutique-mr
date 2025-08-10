import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Star, Edit, ShoppingCart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProductData {
  id: string;
  name: string;
  price_mru: number;
  short_description?: string;
  description?: string;
  rating: number;
  rating_count: number;
  video_url?: string;
  product_images: { url: string; sort_order: number }[];
}

const Product = () => {
  const { productId } = useParams();
  const { isAdmin } = useAuth();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        const { data } = await supabase
          .from('products')
          .select(`
            id,
            name,
            price_mru,
            short_description,
            description,
            rating,
            rating_count,
            video_url,
            product_images(url, sort_order)
          `)
          .eq('id', productId)
          .single();

        if (data) {
          // Sort images by sort_order
          data.product_images = data.product_images?.sort((a, b) => a.sort_order - b.sort_order) || [];
          setProduct(data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({ 
          description: 'خطأ في تحميل بيانات المنتج',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} أوقية موريتانية`;
  };

  const renderRating = () => {
    if (!product) return null;
    
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-muted-foreground" />);
      }
    }
    return stars;
  };

  const handleAddToCart = () => {
    toast({ 
      description: 'تم إضافة المنتج إلى السلة',
    });
  };

  const renderVideo = (videoUrl: string) => {
    // Handle YouTube URLs
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      let videoId = '';
      if (videoUrl.includes('youtube.com/watch?v=')) {
        videoId = videoUrl.split('v=')[1]?.split('&')[0] || '';
      } else if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0] || '';
      }
      
      if (videoId) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full aspect-video rounded-lg"
            allowFullScreen
            title="فيديو المنتج"
          />
        );
      }
    }
    
    // Handle direct video files
    return (
      <video 
        controls 
        className="w-full aspect-video rounded-lg"
        poster={product?.product_images[0]?.url}
      >
        <source src={videoUrl} type="video/mp4" />
        المتصفح لا يدعم تشغيل الفيديو
      </video>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="aspect-square bg-muted rounded-lg" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-8 text-center">
          <h1 className="text-xl font-bold">المنتج غير موجود</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8 space-y-8">
        {/* Product Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
              {renderRating()}
              {product.rating_count > 0 && (
                <span className="text-sm text-muted-foreground">
                  ({product.rating_count} تقييم)
                </span>
              )}
            </div>
            {product.short_description && (
              <p className="text-muted-foreground">{product.short_description}</p>
            )}
          </div>
          {isAdmin && (
            <Button size="sm" variant="outline">
              <Edit className="w-4 h-4 ml-2" />
              تعديل المنتج
            </Button>
          )}
        </div>

        {/* Product Images */}
        {product.product_images.length > 0 && (
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden border">
              <img
                src={product.product_images[selectedImageIndex]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.product_images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.product_images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index 
                        ? 'border-banat-pink' 
                        : 'border-border'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price and Add to Cart */}
        <div className="space-y-4 p-4 bg-card rounded-lg border">
          <div className="text-3xl font-bold text-banat-pink">
            {formatPrice(product.price_mru)}
          </div>
          <Button className="w-full" onClick={handleAddToCart}>
            <ShoppingCart className="w-5 h-5 ml-2" />
            إضافة إلى السلة
          </Button>
        </div>

        {/* Product Details */}
        {product.description && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">تفاصيل المنتج</h2>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>
          </div>
        )}

        {/* Product Video */}
        {product.video_url && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">فيديو المنتج</h2>
            <p className="text-muted-foreground">
              في أخر هذه الصفحة يوجد هذا الفيديو الذي سيعرفنا أكثر على هذا المنتج
            </p>
            {renderVideo(product.video_url)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Product;