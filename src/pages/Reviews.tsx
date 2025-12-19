import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, MapPin, Award, Flag } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import { Button } from "@/components/ui/button";

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
}

/* =======================
   DATA
======================= */

// 👇 CLIENTES (SE QUEDA IGUAL)
const customerVideos: CustomerVideo[] = [
  { id: "1", videoId: "wH-2DUYxKPw", name: "Cliente evento MotoGP", quote: "En la moto estás haciendo físico" },
  { id: "2", videoId: "GANm4vmbvEA", name: "Trabajador Ducati Corse", quote: "Lo más parecido a rodar en circuito" },
  { id: "3", videoId: "lJYINxTIHeM", name: "Lorenzo – Yamaha E-Sports", quote: "La experiencia más inmersiva de mi vida" },
  { id: "4", videoId: "t-9W3vr339A", name: "Cliente Gran Premio", quote: "Tengo una R6 y esto es exquisito" },
  { id: "5", videoId: "AN1V352BxDw", name: "Andrea Saveri – Ducati E-Sports", quote: "Realmente sientes la velocidad" },
  { id: "6", videoId: "pDb6BUL9PcI", name: "Massimo – Ducati Corse", quote: "Es una experiencia bellísima" },
];

// 👇 PILOTOS (NUEVO DISEÑO)
const professionalVideos: ProfessionalVideo[] = [
  {
    id: "1",
    videoId: "nQbrjsr0yiU",
    name: "Álvaro Bautista",
    competed: "WorldSBK · MotoGP",
    achievements: "WorldSBK Champion",
    country: "Spain",
  },
  {
    id: "2",
    videoId: "nQbrjsr0yiU",
    name: "Andrea Saveri",
    competed: "Ducati E-Sports",
    achievements: "E-Sports Champion",
    country: "Italy",
  },
  {
    id: "3",
    videoId: "nQbrjsr0yiU",
    name: "Professional Rider 3",
    competed: "International Championships",
    achievements: "Multiple Podiums",
    country: "Europe",
  },
  {
    id: "4",
    videoId: "nQbrjsr0yiU",
    name: "Professional Rider 4",
    competed: "National Championships",
    achievements: "Race Winner",
    country: "Spain",
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
        <div className="container mx-auto px-4">

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
          <Tabs defaultValue="customers" className="max-w-7xl mx-auto">
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
                CLIENTES (IGUAL QUE ANTES)
            ======================= */}
            <TabsContent value="customers" className="space-y-10">
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

            <TabsContent value="professionals">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {professionalVideos.map((rider) => (
                  <div
                    key={rider.id}
                    className="group flex flex-col md:flex-row items-stretch rounded-xl border border-border bg-card hover:border-primary/40 transition-all"
                  >
                    {/* VIDEO / IMAGE */}
                    <button
                      onClick={() => setSelectedVideo({ videoId: rider.videoId, name: rider.name })}
                      className="relative md:w-[38%] aspect-video overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none bg-black"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${rider.videoId}/hqdefault.jpg`}
                        alt={rider.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-lg">
                          ▶
                        </div>
                      </div>
                    </button>

                    {/* INFO */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-3">
                          {rider.name}
                        </h3>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Flag className="w-4 h-4 text-primary" />
                            <span>{rider.competed}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-primary" />
                            <span>{rider.achievements}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{rider.country}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 text-sm text-primary font-medium">
                        Watch professional feedback →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
