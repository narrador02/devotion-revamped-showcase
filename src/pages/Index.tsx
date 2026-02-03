import Navigation from "@/components/Navigation";
import { useRouteScroll } from "@/hooks/useRouteScroll";
import Hero from "@/components/Hero";
import FeaturedOnTV from "@/components/FeaturedOnTV";
import Products from "@/components/Products";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useTranslation } from "react-i18next";
import UseCases from "@/components/UseCases";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { seoConfig } from "@/config/seoConfig";
import CustomizationSection from "@/components/simulators/CustomizationSection";

const Index = () => {
  const { t, i18n } = useTranslation();

  // Structured data for Organization, LocalBusiness, Service, and WebPage
  const structuredData = [
    seoConfig.organization,
    seoConfig.localBusiness,
    seoConfig.service,
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: t('seo.home.title'),
      description: t('seo.home.description'),
      url: seoConfig.siteUrl,
      inLanguage: i18n.language,
      isPartOf: {
        '@type': 'WebSite',
        name: 'DevotionSim',
        url: seoConfig.siteUrl,
      },
    },
  ];

  // Scroll mapping for Homepage
  const scrollMap = {
    '/': 'hero',
    '/our-simulators': 'simulators-section',
    '/personalization': 'personalization-section',
  };

  useRouteScroll(scrollMap);

  return (
    <div className="min-h-screen bg-background font-inter relative">
      <SEO
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        keywords={t('seo.home.keywords')}
        path="/"
        structuredData={structuredData}
      />

      <div className="relative">
        <Navigation />
        <main>
          <div id="hero"><Hero /></div>
          <div id="que-es"><FeaturedOnTV /></div>
          <div id="events-section"><UseCases /></div>
          <div id="simulators-section"><Products /></div>
          <div id="personalization-section"><CustomizationSection /></div>
        </main>
        <div id="cta-final"><Footer /></div>
        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default Index;
