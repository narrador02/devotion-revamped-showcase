import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import { useRouteScroll } from "@/hooks/useRouteScroll";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, MapPin, Award, Flag, Play, Quote, Star } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

/* =======================
   TYPES
======================= */
interface CustomerVideo {
  id: string;
  videoId: string;
  name: string;
  quote?: string;
}

interface ProfessionalVideo {
  id: string;
  videoId: string;
  name: string;
  competed: string;
  achievements: string;
  country: string;
  countryFlag: string;
  quote: string;
}

/* =======================
   DATA
======================= */

const customerVideos: CustomerVideo[] = [
  { id: "1", videoId: "wH-2DUYxKPw", name: "Cliente evento MotoGP", quote: "En la moto estás haciendo físico" },
  { id: "2", videoId: "GANm4vmbvEA", name: "Trabajador Ducati Corse", quote: "Lo más parecido a rodar en circuito" },
  { id: "3", videoId: "lJYINxTIHeM", name: "Lorenzo – Yamaha E-Sports", quote: "La experiencia más inmersiva de mi vida" },
  { id: "4", videoId: "t-9W3vr339A", name: "Cliente Gran Premio", quote: "Tengo una R6 y esto es exquisito" },
  { id: "5", videoId: "AN1V352BxDw", name: "Andrea Saveri – Ducati E-Sports", quote: "Realmente sientes la velocidad" },
  { id: "6", videoId: "pDb6BUL9PcI", name: "Massimo – Ducati Corse", quote: "Es una experiencia bellísima" },
];

const professionalVideos: ProfessionalVideo[] = [
  {
    id: "1",
    videoId: "nQbrjsr0yiU",
    name: "Álvaro Bautista",
    competed: "WorldSBK · MotoGP",
    achievements: "reviews.pilots.bautista.achievements",
    country: "reviews.pilots.bautista.country",
    countryFlag: "🇪🇸",
    quote: "reviews.pilots.bautista.quote",
  },
  {
    id: "2",
    videoId: "nQbrjsr0yiU",
    name: "Andrea Saveri",
    competed: "Ducati E-Sports",
    achievements: "reviews.pilots.saveri.achievements",
    country: "reviews.pilots.saveri.country",
    countryFlag: "🇮🇹",
    quote: "reviews.pilots.saveri.quote",
  },
  {
    id: "3",
    videoId: "nQbrjsr0yiU",
    name: "Marc García",
    competed: "WorldSSP300",
    achievements: "reviews.pilots.garcia.achievements",
    country: "reviews.pilots.garcia.country",
    countryFlag: "🇪🇸",
    quote: "reviews.pilots.garcia.quote",
  },
  {
    id: "4",
    videoId: "nQbrjsr0yiU",
    name: "Lorenzo Baldassarri",
    competed: "MotoGP · WorldSBK",
    achievements: "reviews.pilots.baldassarri.achievements",
    country: "reviews.pilots.baldassarri.country",
    countryFlag: "🇮🇹",
    quote: "reviews.pilots.baldassarri.quote",
  },
];

/* =======================
   COMPONENT
======================= */

const Reviews = () => {
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState<{ videoId: string; name: string } | null>(null);
  const [showMoreCustomers, setShowMoreCustomers] = useState(false);

  const visibleCustomers = showMoreCustomers ? customerVideos : customerVideos.slice(0, 6);

  // Scroll mapping for Reviews
  const scrollMap = {
    '/opiniones/testimonios': 'testimonios',
    '/reviews/clients': 'clients',
    '/reviews/pilots': 'pilots',
  };

  useRouteScroll(scrollMap);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t("seo.reviews.title")}
        description={t("seo.reviews.description")}
        keywords={t("seo.reviews.keywords")}
        path="/reviews"
      />
      <Navigation />

      <main className="pt-32 pb-24">
        <div id="opiniones-hero" className="container mx-auto px-4">

          {/* HEADER */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-rajdhani font-black text-primary mb-4">
              {t("reviews.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("reviews.subtitle")}
            </p>
          </div>

          {/* TABS */}
          <Tabs id="testimonios" defaultValue="customers" className="max-w-7xl mx-auto">
            <TabsList className="grid grid-cols-2 max-w-md mx-auto mb-14">
              <TabsTrigger value="customers" className="flex gap-2">
                <Users className="w-4 h-4" />
                {t("reviews.tabs.customers")}
              </TabsTrigger>
              <TabsTrigger value="professionals" className="flex gap-2">
                <Trophy className="w-4 h-4" />
                {t("reviews.tabs.professionals")}
              </TabsTrigger>
            </TabsList>

            {/* =======================
                CLIENTES
            ======================= */}
            <TabsContent id="clients" value="customers" className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleCustomers.map((video) => (
                  <VideoCard
                    key={video.id}
                    videoId={video.videoId}
                    title={video.name}
                    quote={video.quote}
                    onClick={() => setSelectedVideo({ videoId: video.videoId, name: video.name })}
                  />
                ))}
              </div>

              {!showMoreCustomers && customerVideos.length > 6 && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setShowMoreCustomers(true)}
                    variant="outline"
                    className="border-primary/40 hover:bg-primary/10"
                  >
                    {t("reviews.showMore")}
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* =======================
                PILOTOS - PREMIUM DESIGN
            ======================= */}
            <TabsContent id="pilots" value="professionals">
              {/* Section Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-sm font-medium text-primary">{t("reviews.pilots.badge")}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-rajdhani font-bold mb-3">
                  {t("reviews.pilots.title")}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {t("reviews.pilots.subtitle")}
                </p>
              </div>

              {/* Premium Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {professionalVideos.map((rider, index) => (
                  <motion.div
                    key={rider.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="group relative bg-gradient-to-br from-card via-card to-muted/30 rounded-2xl border border-border/60 overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.1)]"
                  >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-2xl" />

                    <div className="relative flex flex-col md:flex-row">
                      {/* Video Thumbnail */}
                      <button
                        onClick={() => setSelectedVideo({ videoId: rider.videoId, name: rider.name })}
                        className="relative md:w-2/5 aspect-video md:aspect-[4/5] overflow-hidden"
                      >
                        <img
                          src={`https://img.youtube.com/vi/${rider.videoId}/maxresdefault.jpg`}
                          alt={rider.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:bg-gradient-to-r md:from-transparent md:via-black/20 md:to-black/60" />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                            <Play className="w-7 h-7 text-white fill-white ml-1" />
                          </div>
                        </div>

                        {/* Country Flag Badge */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                          <span className="text-lg">{rider.countryFlag}</span>
                          <span className="text-xs text-white/90 font-medium">{t(rider.country)}</span>
                        </div>
                      </button>

                      {/* Content */}
                      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative z-10">
                        {/* Header */}
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-rajdhani font-bold text-foreground mb-1">
                                {rider.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                                <Flag className="w-3.5 h-3.5" />
                                <span>{rider.competed}</span>
                              </div>
                            </div>
                          </div>

                          {/* Achievement Badge */}
                          <div className="flex items-center gap-2 mb-6">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                              <Award className="w-4 h-4 text-amber-500" />
                              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                {t(rider.achievements)}
                              </span>
                            </div>
                          </div>

                          {/* Quote */}
                          <div className="relative">
                            <Quote className="absolute -top-2 -left-1 w-8 h-8 text-primary/20" />
                            <p className="text-muted-foreground italic pl-6 leading-relaxed">
                              "{t(rider.quote)}"
                            </p>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-6 pt-4 border-t border-border/40">
                          <button
                            onClick={() => setSelectedVideo({ videoId: rider.videoId, name: rider.name })}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/link"
                          >
                            {t("reviews.pilots.watchVideo")}
                            <span className="inline-block transition-transform group-hover/link:translate-x-1">→</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                {[
                  { value: "50+", labelKey: "reviews.stats.professionals" },
                  { value: "12", labelKey: "reviews.stats.countries" },
                  { value: "100%", labelKey: "reviews.stats.satisfaction" },
                  { value: "WorldSBK", labelKey: "reviews.stats.topLevel" },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="text-center p-6 rounded-xl bg-muted/30 border border-border/50"
                  >
                    <div className="text-3xl font-rajdhani font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{t(stat.labelKey)}</div>
                  </div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <LanguageSwitcher />

      <VideoModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoId={selectedVideo?.videoId || ""}
        title={selectedVideo?.name || ""}
      />
    </div>
  );
};

export default Reviews;