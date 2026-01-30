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
    '/eventos': 'eventos',
    '/personalizacion': 'personalizacion',
    '/contacto': 'cta-final',
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
          <div id="simuladores"><UseCases /></div>
          <div id="eventos"><div className="py-20 bg-black"><h2 className="text-3xl font-bold text-center text-white mb-8">Eventos & Apariciones</h2><Products /></div></div>
          {/* Note: 'Products' component seems to be used as a placeholder or multi-purpose here. 
              Ideally, if 'Products' lists simulators, it should match 'simuladores'. 
              Based on user request: 'Eventos' -> id="eventos". 
              Let's Wrap the relevant components. 
              Wait, UseCases is usually 'What is Devotion'. 
              Let's adjust based on typical structure. 
          */}

          {/* RE-MAPPING based on strict user request:
              Hero -> id="hero"
              What Is -> id="que-es"
              Events -> id="eventos"
              Simulators -> id="simuladores"
              Personalization -> id="personalizacion"
              CTA -> id="cta-final"
          */}

          <div id="hero"><Hero /></div>
          <div id="que-es"><FeaturedOnTV /></div>
          {/* UseCases seems to be the 'What is' or 'Why Us' section */}
          <div id="eventos"><UseCases /></div>
          {/* Note: In usual structure UseCases is often 'Events/Appearances' context? 
              Actually, Products component usually lists the Simulators. 
          */}
          <div id="simuladores"><Products /></div>
          <div id="personalizacion"><CustomizationSection /></div>
        </main>
        <div id="cta-final"><Footer /></div>
        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default Index;


