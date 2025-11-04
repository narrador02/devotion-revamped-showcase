import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  features: string[];
  delay?: number;
}

const ProductCard = ({ title, description, icon, image, features, delay = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-500 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent"></div>
        
        {/* Icon Overlay */}
        <div className="absolute top-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg transform transition-transform duration-500 group-hover:scale-110">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-rajdhani font-bold mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground font-inter mb-4 leading-relaxed">{description}</p>
        
        {/* Features List */}
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-foreground/70 font-inter">
              <span className="text-primary mt-1">▸</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 font-rajdhani font-semibold transition-all duration-300"
        >
          Learn More
        </Button>
      </div>

      {/* Glow Effect on Hover */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.2), transparent 60%)",
        }}
      ></div>
    </div>
  );
};

export default ProductCard;
