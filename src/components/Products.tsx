import ProductCard from "./ProductCard";
import { Zap, Heart, Globe } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import { useTranslation } from "react-i18next";

const Products = () => {
  const { t } = useTranslation();
  
  const products = [
    {
      title: t('products.timeAttack.title'),
      description: t('products.timeAttack.description'),
      icon: <Zap className="text-white" size={28} />,
      image: product1,
      features: [
        t('products.timeAttack.features.axis'),
        t('products.timeAttack.features.lean'),
        t('products.timeAttack.features.wheelie'),
        t('products.timeAttack.features.compatible')
      ]
    },
    {
      title: t('products.withLove.title'),
      description: t('products.withLove.description'),
      icon: <Heart className="text-white" size={28} />,
      image: product2,
      features: [
        t('products.withLove.features.handcrafted'),
        t('products.withLove.features.premium'),
        t('products.withLove.features.community'),
        t('products.withLove.features.updates')
      ]
    },
    {
      title: t('products.global.title'),
      description: t('products.global.description'),
      icon: <Globe className="text-white" size={28} />,
      image: product3,
      features: [
        t('products.global.features.circuits'),
        t('products.global.features.multiplayer'),
        t('products.global.features.leaderboards'),
        t('products.global.features.multilanguage')
      ]
    }
  ];

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-rajdhani font-bold mb-4">
            <span className="text-foreground">{t('products.sectionTitle')} </span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t('products.sectionTitleHighlight')}</span>
          </h2>
          <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
            {t('products.sectionSubtitle')}
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
