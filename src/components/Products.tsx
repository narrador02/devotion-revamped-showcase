import ProductCard from "./ProductCard";
import { Zap, Gauge, Rocket } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
// Video imports
import videoTimeAttack from "@/assets/eje2-wheelie.mp4";
import videoSlady from "@/assets/eje3-desliz.mp4";
import videoTopGun from "@/assets/eje4-aceler.mp4";
import { useTranslation } from "react-i18next";

const Products = () => {
  const { t } = useTranslation();

  const products = [
    {
      id: "timeattack",
      title: t('products.timeAttack.title'),
      description: t('products.timeAttack.description'),
      icon: <Zap className="text-white" size={28} />,
      image: product1,
      // Video config - 4s seamless loop
      video: videoTimeAttack,
      videoLoop: true,
      videoPreload: "metadata" as const,
      features: [
        t('products.timeAttack.features.axis'),
        t('products.timeAttack.features.lean'),
        t('products.timeAttack.features.wheelie'),
        t('products.timeAttack.features.compatible')
      ]
    },
    {
      id: "slady",
      title: t('products.slady.title'),
      description: t('products.slady.description'),
      icon: <Gauge className="text-white" size={28} />,
      image: product2,
      // Video config - 2s non-loop
      video: videoSlady,
      videoLoop: false,
      videoMaxPlays: 1,
      videoPreload: "none" as const,
      features: [
        t('products.slady.features.axis'),
        t('products.slady.features.lean'),
        t('products.slady.features.drift'),
        t('products.slady.features.compatible')
      ]
    },
    {
      id: "topgun",
      title: t('products.topGun.title'),
      description: t('products.topGun.description'),
      icon: <Rocket className="text-white" size={28} />,
      image: product3,
      // Video config - 2s non-loop
      video: videoTopGun,
      videoLoop: false,
      videoMaxPlays: 1,
      videoPreload: "none" as const,
      features: [
        t('products.topGun.features.axis'),
        t('products.topGun.features.lean'),
        t('products.topGun.features.drift'),
        t('products.topGun.features.velocity'),
        t('products.topGun.features.compatible')
      ]
    }
  ];

  return (
    <section id="products" className="pt-10 pb-20 md:py-10 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-rajdhani font-bold mb-4">
            <span className="text-foreground">{t('products.sectionTitle')} </span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t('products.sectionTitleHighlight')}</span>
          </h2>
          <p className="text-lg text-muted-foreground font-inter max-w-4xl mx-auto">
            {t('products.sectionSubtitle')}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              {...product}
              productId={product.id}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
