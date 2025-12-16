import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-bg-new.jpg";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Hero = () => {
  const { t } = useTranslation();

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center md:bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: 'center 30%',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:pt-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-rajdhani font-bold mb-6 leading-[1.1] md:leading-tight">
            <span className="text-foreground">{t('hero.titlePart1')}</span>{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t('hero.titlePart2')}</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 mb-12 font-inter max-w-3xl mx-auto leading-relaxed px-2">
            {t('hero.mission')}{" "}
            <span className="text-primary font-semibold">{t('hero.highPerformance')}</span>{" "}
            {t('hero.missionEnd')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 md:mb-16">
            <Button
              size="lg"
              onClick={scrollToProducts}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 font-rajdhani font-semibold text-base md:text-lg px-6 md:px-8 h-11 md:h-12 w-full sm:w-auto sm:min-w-[200px] shadow-lg"
            >
              {t('hero.exploreProducts')}
            </Button>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-rajdhani font-semibold text-base md:text-lg px-6 md:px-8 h-11 md:h-12 w-full sm:min-w-[200px]"
              >
                {t('hero.contactUs')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
