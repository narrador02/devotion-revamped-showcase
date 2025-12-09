import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Zap, Gauge, Rocket, Check, ArrowRight, ChevronDown } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { useState } from "react";

const Simuladores = () => {
  const { t } = useTranslation();
  const [showComparison, setShowComparison] = useState(false);


  const products = [
    {
      id: "timeattack",
      title: t('products.timeAttack.title'),
      shortDesc: t('products.timeAttack.description'),
      fullDesc: t('products.timeAttack.fullDescription'),
      icon: <Zap className="text-white" size={40} />,
      image: product1,
      color: "blue",
      gradient: "from-blue-500/20 to-blue-600/5",
      border: "border-blue-500/50",
      badge: "2-Axis",
      bestFor: "Events & Entertainment",
      features: [
        t('products.timeAttack.features.axis'),
        t('products.timeAttack.features.lean'),
        t('products.timeAttack.features.wheelie'),
        t('products.timeAttack.features.compatible')
      ],
      specs: {
        type: t('products.timeAttack.specs.type'),
        weight: t('products.timeAttack.specs.weight'),
        dimensions: t('products.timeAttack.specs.dimensions'),
        transport: t('products.timeAttack.specs.transport')
      }
    },
    {
      id: "slady",
      title: t('products.slady.title'),
      shortDesc: t('products.slady.description'),
      fullDesc: t('products.slady.fullDescription'),
      icon: <Gauge className="text-white" size={40} />,
      image: product2,
      color: "purple",
      gradient: "from-purple-500/20 to-purple-600/5",
      border: "border-purple-500/50",
      badge: "3-Axis",
      bestFor: "Schools & Training",
      features: [
        t('products.slady.features.axis'),
        t('products.slady.features.lean'),
        t('products.slady.features.drift'),
        t('products.slady.features.compatible')
      ],
      specs: {
        type: t('products.slady.specs.type'),
        weight: t('products.slady.specs.weight'),
        dimensions: t('products.slady.specs.dimensions'),
        transport: t('products.slady.specs.transport')
      }
    },
    {
      id: "topgun",
      title: t('products.topGun.title'),
      shortDesc: t('products.topGun.description'),
      fullDesc: t('products.topGun.fullDescription'),
      icon: <Rocket className="text-white" size={40} />,
      image: product3,
      color: "amber",
      gradient: "from-amber-500/20 to-amber-600/5",
      border: "border-amber-500/50",
      badge: "4-Axis",
      bestFor: "Professional Training",
      features: [
        t('products.topGun.features.axis'),
        t('products.topGun.features.lean'),
        t('products.topGun.features.drift'),
        t('products.topGun.features.velocity'),
        t('products.topGun.features.compatible')
      ],
      specs: {
        type: t('products.topGun.specs.type'),
        weight: t('products.topGun.specs.weight'),
        dimensions: t('products.topGun.specs.dimensions'),
        transport: t('products.topGun.specs.transport')
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background font-inter">
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
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-7xl font-rajdhani font-bold mb-6">
              <span className="text-foreground">{t('products.sectionTitle')} </span>
              <span className="text-primary">{t('products.sectionTitleHighlight')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              {t('products.sectionSubtitle')}
            </p>
            <Button
              onClick={() => setShowComparison(!showComparison)}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg"
            >
              {showComparison ? 'View Models' : 'Compare Models'}
              <ArrowRight className="ml-2" />
            </Button>
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
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${product.gradient} mb-3`}>
                  {product.icon}
                </div>
                <h3 className="font-rajdhani font-bold text-xl mb-1">{product.title}</h3>
                <p className="text-sm text-muted-foreground">{product.badge} System</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      {showComparison && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="py-16 bg-card/50"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-rajdhani font-bold text-center mb-12">
              Model Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-4 font-rajdhani font-bold text-lg">Feature</th>
                    {products.map(product => (
                      <th key={product.id} className="p-4 text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${product.gradient} mb-2`}>
                          {product.icon}
                        </div>
                        <div className="font-rajdhani font-bold text-lg">{product.title}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium">Movement System</td>
                    {products.map(product => (
                      <td key={product.id} className="p-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${product.gradient} border ${product.border}`}>
                          {product.badge}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium">Best For</td>
                    {products.map(product => (
                      <td key={product.id} className="p-4 text-center text-sm">{product.bestFor}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium">Weight</td>
                    {products.map(product => (
                      <td key={product.id} className="p-4 text-center text-sm">{product.specs.weight}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium">Lean Angle</td>
                    {products.map(product => (
                      <td key={product.id} className="p-4 text-center text-sm">Up to 54°</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>
      )}

      {/* Product Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-32">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                id={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                {/* Image Side */}
                <div className="w-full lg:w-1/2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="relative group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
                    <div className={`relative overflow-hidden rounded-3xl border-2 ${product.border} shadow-2xl`}>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-[500px] object-cover"
                      />
                      <div className={`absolute top-6 right-6 px-4 py-2 rounded-full bg-gradient-to-r ${product.gradient} border ${product.border} backdrop-blur-sm`}>
                        <span className="font-bold text-sm">{product.badge}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${product.gradient} border ${product.border}`}>
                    {product.icon}
                  </div>

                  <div>
                    <h2 className="text-5xl font-rajdhani font-bold mb-3">{product.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4">Best for: {product.bestFor}</p>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      {product.shortDesc}
                    </p>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {product.fullDesc}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h3 className="font-rajdhani font-bold text-xl mb-4">Key Features</h3>
                    {product.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${product.gradient} border ${product.border} flex items-center justify-center shrink-0`}>
                          <Check size={14} className="text-foreground" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${product.gradient} border ${product.border}`}>
                      <div className="text-sm text-muted-foreground mb-1">Type</div>
                      <div className="font-bold text-sm">{product.specs.type}</div>
                    </div>
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${product.gradient} border ${product.border}`}>
                      <div className="text-sm text-muted-foreground mb-1">Weight</div>
                      <div className="font-bold text-sm">{product.specs.weight}</div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className={`w-full md:w-auto bg-${product.color}-500 hover:bg-${product.color}-600 text-white px-8 py-6 rounded-full shadow-lg`}
                  >
                    {t('products.learnMore')}
                    <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
              Ready to Experience the Thrill?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Contact us to learn more about our simulators or to schedule a demo.
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
                View Pricing
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <LanguageSwitcher />
    </div>
  );
};

export default Simuladores;
