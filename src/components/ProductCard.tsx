import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ProductVideo from "@/components/ProductVideo";

interface ProductCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string; // Used as poster image
  features: string[];
  delay?: number;
  productId: string;
  // Video properties (required)
  video: string;
  videoLoop?: boolean;
  videoMaxPlays?: number;
  videoPreload?: 'none' | 'metadata';
}

const ProductCard = ({
  title,
  description,
  icon,
  image,
  features,
  delay = 0,
  productId,
  video,
  videoLoop,
  videoMaxPlays,
  videoPreload
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate(`/simuladores#${productId}`);
  };


  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-500 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Container - 1:1 aspect ratio */}
      <div className="relative aspect-square overflow-hidden">
        <ProductVideo
          id={`product-${productId}`}
          videoSrc={video!}
          posterSrc={image}
          alt={title}
          className="w-full h-full"
          loop={videoLoop}
          maxPlays={videoMaxPlays}
          preloadMode={videoPreload}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent pointer-events-none"></div>

        {/* Icon Overlay */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 w-14 h-14 md:w-16 md:h-16 rounded-full bg-black border-2 border-primary flex items-center justify-center shadow-lg transform transition-transform duration-500 group-hover:scale-110 z-10">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-rajdhani font-bold mb-4 md:mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground font-inter mb-6 md:mb-4 leading-relaxed">{description}</p>

        <Button
          onClick={handleLearnMore}
          variant="outline"
          className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-rajdhani font-semibold transition-all duration-300"
        >
          {t('products.learnMore')}
        </Button>
      </div>

      {/* Glow Effect on Hover - Disabled on mobile touch devices */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 hidden md:block ${isHovered ? "opacity-100" : "opacity-0"
          }`}
        style={{
          background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.2), transparent 60%)",
        }}
      ></div>
    </div>
  );
};

export default ProductCard;

