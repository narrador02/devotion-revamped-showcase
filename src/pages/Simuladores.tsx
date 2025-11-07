import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { Zap, Gauge, Rocket } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Simuladores = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [api, setApi] = useState<CarouselApi>();

  const products = [
    {
      id: "timeattack",
      title: t('products.timeAttack.title'),
      description: t('products.timeAttack.fullDescription'),
      icon: <Zap className="text-white" size={48} />,
      image: product1,
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
      description: t('products.slady.fullDescription'),
      icon: <Gauge className="text-white" size={48} />,
      image: product2,
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
      description: t('products.topGun.fullDescription'),
      icon: <Rocket className="text-white" size={48} />,
      image: product3,
      features: [
        t('products.topGun.features.axis'),
        t('products.topGun.features.lean'),
        t('products.topGun.features.drift'),
        t('products.topGun.features.velocity'),
        t('products.topGun.features.compatible')
      ]
    }
  ];

  useEffect(() => {
    if (!api) return;
    
    const hash = location.hash.replace('#', '');
    if (hash) {
      const productIndex = products.findIndex(p => p.id === hash);
      if (productIndex !== -1) {
        api.scrollTo(productIndex);
      }
    }
  }, [api, location.hash]);

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-rajdhani font-bold mb-4">
              <span className="text-foreground">{t('nav.products')}</span>
            </h1>
          </div>

          <Carousel setApi={setApi} className="w-full max-w-6xl mx-auto">
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem key={product.id}>
                  <div id={product.id} className="min-h-[80vh] flex flex-col md:flex-row items-center gap-8 p-8">
                    {/* Image Section */}
                    <div className="w-full md:w-1/2 relative">
                      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-[400px] md:h-[600px] object-cover"
                        />
                        <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                          {product.icon}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full md:w-1/2 space-y-6">
                      <h2 className="text-4xl md:text-5xl font-rajdhani font-bold text-foreground">
                        {product.title}
                      </h2>
                      <p className="text-lg text-muted-foreground font-inter leading-relaxed">
                        {product.description}
                      </p>
                      
                      {/* Features List */}
                      <div className="space-y-3">
                        <h3 className="text-2xl font-rajdhani font-semibold text-foreground">
                          Features
                        </h3>
                        <ul className="space-y-2">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3 text-foreground/80 font-inter">
                              <span className="text-primary mt-1">▸</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Simuladores;
