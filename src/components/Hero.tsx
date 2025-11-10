import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-rajdhani font-bold mb-6 leading-tight">
            <span className="text-foreground">{t('hero.simulator')}</span>{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t('hero.motoGP')}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-12 font-inter max-w-3xl mx-auto leading-relaxed">
            {t('hero.mission')}{" "}
            <span className="text-primary font-semibold">{t('hero.highPerformance')}</span>{" "}
            {t('hero.missionEnd')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 font-rajdhani font-semibold text-lg px-8 h-14 animate-glow-pulse"
            >
              {t('hero.exploreProducts')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-rajdhani font-semibold text-lg px-8 h-14"
            >
              {t('hero.contactUs')}
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-primary" size={32} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
