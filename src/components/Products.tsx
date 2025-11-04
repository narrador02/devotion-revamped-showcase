import ProductCard from "./ProductCard";
import { Zap, Heart, Globe } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const Products = () => {
  const products = [
    {
      title: "Challenges",
      description: "Push your limits with realistic circuit challenges that test your skills and precision.",
      icon: <Zap className="text-white" size={28} />,
      image: product1,
      features: [
        "Advanced motion simulation technology",
        "Multiple difficulty levels",
        "Real-time performance analytics",
        "Customizable track conditions"
      ]
    },
    {
      title: "With Love",
      description: "Crafted with passion by motorcycling enthusiasts for the racing community worldwide.",
      icon: <Heart className="text-white" size={28} />,
      image: product2,
      features: [
        "Handcrafted attention to detail",
        "Premium materials and components",
        "Community-driven development",
        "Regular content updates"
      ]
    },
    {
      title: "Global",
      description: "Experience tracks from around the world and compete with riders across the globe.",
      icon: <Globe className="text-white" size={28} />,
      image: product3,
      features: [
        "International circuit collection",
        "Online multiplayer races",
        "Global leaderboards",
        "Multi-language support"
      ]
    }
  ];

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-rajdhani font-bold mb-4">
            <span className="text-foreground">Our </span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
            Experience the perfect blend of technology, passion, and global racing culture
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.title}
              {...product}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
