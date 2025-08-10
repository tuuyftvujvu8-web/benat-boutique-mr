import React from "react";

interface CategoryCardProps {
  title: string;
  imageUrl: string;
  slug: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, imageUrl, slug }) => {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-border shadow-sm hover:shadow-md transition hover:-translate-y-0.5" aria-label={title}>
      <a href={`/products/${slug}`} className="block">
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={`فئة ${title} من متجر بنات Benat في موريتانيا`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
      </div>
      <div className="absolute inset-x-2 bottom-2">
        <div className="rounded-md bg-background/80 backdrop-blur px-3 py-1.5 text-center text-sm font-semibold text-foreground border border-border">
          {title}
        </div>
      </div>
      </a>
    </article>
  );
};

export default CategoryCard;
