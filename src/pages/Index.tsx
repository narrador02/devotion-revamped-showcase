import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useTranslation } from "react-i18next";
import UseCases from "@/components/UseCases";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { seoConfig } from "@/config/seoConfig";

const Index = () => {
  const { t } = useTranslation();

  // Structured data for Organization and Products
  const structuredData = [
    seoConfig.organization,
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: t('seo.home.title'),
      description: t('seo.home.description'),
      url: seoConfig.siteUrl,
    },
  ];

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
          <Hero />
          <UseCases />
          <Products />
        </main>
        <Footer />
        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default Index;
