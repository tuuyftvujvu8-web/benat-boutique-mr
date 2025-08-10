import { Link } from 'react-router-dom';
import { Star, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price_mru: number;
    short_description?: string;
    rating: number;
    rating_count: number;
    product_images: { url: string; sort_order: number }[];
  };
  isAdmin?: boolean;
}

const ProductCard = ({ product, isAdmin }: ProductCardProps) => {
  const mainImage = product.product_images
    ?.sort((a, b) => a.sort_order - b.sort_order)?.[0]?.url;

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} أوقية`;
  };

  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-muted-foreground" />);
      }
    }
    return stars;
  };

  return (
    <article className="group relative">
      {isAdmin && (
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit className="w-3 h-3" />
        </Button>
      )}
      
      <Link to={`/product/${product.id}`} className="block">
        <div className="overflow-hidden rounded-lg border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <div className="aspect-[3/4] w-full overflow-hidden">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">لا توجد صورة</span>
              </div>
            )}
          </div>
          
          <div className="p-3 space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-1">
              {renderRating()}
              {product.rating_count > 0 && (
                <span className="text-xs text-muted-foreground mr-1">
                  ({product.rating_count})
                </span>
              )}
            </div>
            
            <div className="text-lg font-bold text-banat-pink">
              {formatPrice(product.price_mru)}
            </div>
            
            <Button size="sm" className="w-full">
              عرض التفاصيل
            </Button>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;