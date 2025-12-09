import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import { Button } from "@/components/ui/button";

interface Video {
  id: string;
  videoId: string;
  name: string;
  quote?: string;
}

const professionalVideos: Video[] = [
  { id: "1", videoId: "nQbrjsr0yiU", name: "Professional Rider 1", quote: "" },
  { id: "2", videoId: "nQbrjsr0yiU", name: "Professional Rider 2", quote: "" },
  { id: "3", videoId: "nQbrjsr0yiU", name: "Professional Rider 3", quote: "" },
  { id: "4", videoId: "nQbrjsr0yiU", name: "Professional Rider 4", quote: "" },
  { id: "5", videoId: "nQbrjsr0yiU", name: "Professional Rider 5", quote: "" },
  { id: "6", videoId: "nQbrjsr0yiU", name: "Professional Rider 6", quote: "" },
  { id: "7", videoId: "nQbrjsr0yiU", name: "Professional Rider 7", quote: "" },
  { id: "8", videoId: "nQbrjsr0yiU", name: "Professional Rider 8", quote: "" },
];

const customerVideos: Video[] = [
  { id: "1", videoId: "wH-2DUYxKPw", name: "Cliente evento MotoGP", quote: "En la moto estás haciendo físico" },
  { id: "2", videoId: "GANm4vmbvEA", name: "Trabajador de Ducati Corse", quote: "Lo más parecido a rodar en circuito" },
  { id: "3", videoId: "lJYINxTIHeM", name: "Lorenzo, Campeón Yamaha E-Sports", quote: "La experiencia más inmersiva de mi vida" },
  { id: "4", videoId: "t-9W3vr339A", name: "Cliente evento MotoGP", quote: "Tengo una R6 y esto es exquisito" },
  { id: "5", videoId: "AN1V352BxDw", name: "Andrea Saveri, Campeón Ducati E-Sports", quote: "Realmente sientes la velocidad" },
  { id: "6", videoId: "pDb6BUL9PcI", name: "Massimo, Rider Ducati Corse ", quote: "Es una experiencia bellísima" },
  { id: "7", videoId: "9qjBymWBjwg", name: "Australian Rider", quote: "Sentimiento de adrenalina increíble, ¡compra una!" },
  { id: "8", videoId: "_zz-fnpKgno", name: "Cliente Gran Premio", quote: "Muy parecido a rodar en circuito" },
];

const Reviews = () => {
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showMoreProfessionals, setShowMoreProfessionals] = useState(false);
  const [showMoreCustomers, setShowMoreCustomers] = useState(false);

  const visibleProfessionalVideos = showMoreProfessionals ? professionalVideos : professionalVideos.slice(0, 6);
  const visibleCustomerVideos = showMoreCustomers ? customerVideos : customerVideos.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold font-rajdhani mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('reviews.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('reviews.subtitle')}
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="customers" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
                <TabsTrigger value="customers" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t('reviews.tabs.customers')}
                </TabsTrigger>
                <TabsTrigger value="professionals" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  {t('reviews.tabs.professionals')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="professionals" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {visibleProfessionalVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      videoId={video.videoId}
                      title={video.name}
                      quote={video.quote}
                      onClick={() => setSelectedVideo(video)}
                    />
                  ))}
                </div>
                {!showMoreProfessionals && professionalVideos.length > 6 && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={() => setShowMoreProfessionals(true)}
                      variant="outline"
                      className="border-primary/40 hover:bg-primary/10"
                    >
                      {t('reviews.showMore')}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="customers" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {visibleCustomerVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      videoId={video.videoId}
                      title={video.name}
                      quote={video.quote}
                      onClick={() => setSelectedVideo(video)}
                    />
                  ))}
                </div>
                {!showMoreCustomers && customerVideos.length > 6 && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={() => setShowMoreCustomers(true)}
                      variant="outline"
                      className="border-primary/40 hover:bg-primary/10"
                    >
                      {t('reviews.showMore')}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
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
