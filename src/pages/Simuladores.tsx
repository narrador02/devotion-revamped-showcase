import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Zap, Gauge, Rocket, ChevronDown, ArrowRight, BarChart2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import SEO from "@/components/SEO";
import { seoConfig } from "@/config/seoConfig";
import { useState } from "react";
import { simulatorsData } from "@/data/simulators";
import SimulatorCard from "@/components/simulators/SimulatorCard";
import ModelDrawer from "@/components/simulators/ModelDrawer";
import CompareDialog from "@/components/simulators/CompareDialog";
import StickyCTA from "@/components/simulators/StickyCTA";
import TrustBlock from "@/components/simulators/TrustBlock";
import { SimulatorModel } from "@/types/simulator";
import { Link } from "react-router-dom";

const Simuladores = () => {
  const { t } = useTranslation();
  const [selectedModel, setSelectedModel] = useState<SimulatorModel | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handleLearnMore = (model: SimulatorModel) => {
    setSelectedModel(model);
    setIsDrawerOpen(true);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="text-white" size={24} />;
      case 'Gauge': return <Gauge className="text-white" size={24} />;
      case 'Rocket': return <Rocket className="text-white" size={24} />;
      default: return <Zap className="text-white" size={24} />;
    }
  };

  // Structured data from config
  const structuredData = [
    seoConfig.products.timeAttack,
    seoConfig.products.slady,
    seoConfig.products.topGun,
  ];

  return (
    <div className="min-h-screen bg-background font-inter">
      <SEO
        title={t('seo.simulators.title')}
        description={t('seo.simulators.description')}
        keywords={t('seo.simulators.keywords')}
        path="/simuladores"
        type="product"
        structuredData={structuredData}
      />
      <Helmet>
        <title>{t('nav.products')} | DevotionSim</title>
        <meta name="description" content={t('products.sectionSubtitle')} />
      </Helmet>
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h1 className="text-6xl md:text-7xl font-rajdhani font-bold mb-6">
              <span className="text-foreground">{t('products.sectionTitle')} </span>
              <span className="text-primary">{t('products.sectionTitleHighlight')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              {t('products.sectionSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setIsCompareOpen(true)}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg w-full sm:w-auto"
              >
                <BarChart2 className="mr-2 h-5 w-5" />
                {t('products.comparison.title')}
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg rounded-full border-2 w-full sm:w-auto"
              >
                <Link to="/specs">
                  <FileText className="mr-2 h-5 w-5" />
                  {t('products.specsPage.viewFullSpecs')}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex justify-center mt-12"
          >
            <ChevronDown className="text-muted-foreground animate-bounce" size={32} />
          </motion.div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="py-8 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {simulatorsData.models.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${product.gradientClass} mb-3`}>
                  {getIcon(product.iconName)}
                </div>
                <h3 className="font-rajdhani font-bold text-xl mb-1">{t(product.title)}</h3>
                <p className="text-sm text-muted-foreground">{product.badge} System</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-32">
            {simulatorsData.models.map((product, index) => (
              <SimulatorCard
                key={product.id}
                model={product}
                index={index}
                onLearnMore={handleLearnMore}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Block */}
      <TrustBlock />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-rajdhani font-bold mb-6">
              {t('products.ctaTitle')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('products.ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg"
              >
                {t('hero.contactUs')}
                <ArrowRight className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg rounded-full border-2"
              >
                {t('products.viewPricing')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <LanguageSwitcher />

      {/* Drawers and Dialogs */}
      <ModelDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        model={selectedModel}
        sharedSpecs={simulatorsData.sharedSpecs}
        options={simulatorsData.options}
        onCompare={() => {
          setIsDrawerOpen(false); // Optional: close drawer when opening compare? Or keep both? 
          // Better UX typically to close drawer if using a centralized modal, OR stack them.
          // But if I close drawer, 'back' flow is weird. 
          // Stacking is fine. ShadCN dialogs usually stack safely.
          // I'll leave drawer open but set comparison to true. 
          // Actually, for mobile "Bottom sheet", stacking might be crowded. 
          // Let's close drawer for clarity since compare view has all models.
          setIsDrawerOpen(false);
          setIsCompareOpen(true);
        }}
      />

      <CompareDialog
        open={isCompareOpen}
        onOpenChange={setIsCompareOpen}
      />

      <StickyCTA />
    </div>
  );
};

export default Simuladores;
