import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import UnifiedContactForm from "@/components/UnifiedContactForm";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Truck, Headphones } from "lucide-react";
import { Helmet } from "react-helmet-async";
import SEO from "@/components/SEO";

const RentPurchase = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: t('rentPurchase.benefits.quality'),
      description: t('rentPurchase.benefits.qualityDesc')
    },
    {
      icon: <Truck className="w-6 h-6 text-primary" />,
      title: t('rentPurchase.benefits.shipping'),
      description: t('rentPurchase.benefits.shippingDesc')
    },
    {
      icon: <Headphones className="w-6 h-6 text-primary" />,
      title: t('rentPurchase.benefits.support'),
      description: t('rentPurchase.benefits.supportDesc')
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
      title: t('rentPurchase.benefits.warranty'),
      description: t('rentPurchase.benefits.warrantyDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-background font-inter">
      <SEO
        title={t('seo.rentPurchase.title')}
        description={t('seo.rentPurchase.description')}
        keywords={t('seo.rentPurchase.keywords')}
        path="/rent-purchase"
      />
      <Helmet>
        <title>{t('rentPurchase.title')} | DevotionSim</title>
        <meta name="description" content={t('rentPurchase.subtitle')} />
      </Helmet>
      <Navigation />

      <div className="flex flex-col lg:flex-row min-h-screen pt-20">
        {/* Left Side - Visuals & Info */}
        <div className="lg:w-5/12 bg-muted/30 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-lg mx-auto lg:mx-0"
          >
            <h1 className="text-4xl lg:text-5xl font-rajdhani font-bold mb-6 text-foreground">
              {t('rentPurchase.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              {t('rentPurchase.subtitle')}
            </p>

            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-4"
                >
                  <div className="p-3 rounded-xl bg-background border border-border shadow-sm shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-7/12 p-8 lg:p-12 bg-background flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl mx-auto w-full"
          >
            <UnifiedContactForm defaultRequestType="rent" />
          </motion.div>
        </div>
      </div>
      <LanguageSwitcher />
    </div>
  );
};

export default RentPurchase;
