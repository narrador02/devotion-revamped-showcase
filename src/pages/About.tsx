import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background font-inter">
      <SEO
        title={t('seo.about.title')}
        description={t('seo.about.description')}
        keywords={t('seo.about.keywords')}
        path="/about"
      />
      <Helmet>
        <title>About Us | DevotionSim</title>
        <meta name="description" content="Learn about the passion and engineering behind DevotionSim's professional motorcycle simulators." />
      </Helmet>
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-rajdhani font-bold mb-6">
              <span className="text-foreground">{t('about.title')}</span> <span className="text-primary">{t('about.subtitle')}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-5xl mx-auto leading-relaxed">
              {t('about.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-rajdhani font-bold mb-4 text-foreground">{t('about.missionTitle')}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {t('about.missionText1')}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('about.missionText2')}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-card p-2 rounded-2xl border border-border shadow-xl overflow-hidden"
            >
              {/* Google Maps Embed - Carrer dels Almogavers 209, Barcelona */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2993.5!2d2.1899584!3d41.3979937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2ses!4v1702838400000"
                width="100%"
                height="350"
                style={{ border: 0, borderRadius: '0.75rem' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="DevotionSim Location - Barcelona"
                className="rounded-lg"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { title: t('about.values.innovation'), desc: t('about.values.innovationDesc') },
              { title: t('about.values.quality'), desc: t('about.values.qualityDesc') },
              { title: t('about.values.passion'), desc: t('about.values.passionDesc') }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <h3 className="text-xl font-rajdhani font-bold mb-2 text-primary">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </main>
      <Footer />
      <LanguageSwitcher />
    </div>
  );
};

export default About;
