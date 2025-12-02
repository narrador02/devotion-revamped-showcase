import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Star, Quote } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import SpeedLines from "@/components/SpeedLines";
import { fetchYouTubeVideoInfo } from "@/lib/youtube";

interface Video {
  id: string;
  videoId: string;
  name: string;
  quote: string;
}

const professionalVideos: Video[] = [
  { id: "1", videoId: "nQbrjsr0yiU", name: "Marc Márquez", quote: "The simulator helps me perfect every corner" },
  { id: "2", videoId: "nQbrjsr0yiU", name: "Valentino Rossi", quote: "Training without risk, racing with confidence" },
  { id: "3", videoId: "nQbrjsr0yiU", name: "Jorge Lorenzo", quote: "Every lap brings me closer to perfection" },
  { id: "4", videoId: "nQbrjsr0yiU", name: "Andrea Dovizioso", quote: "The most realistic training experience" },
  { id: "5", videoId: "nQbrjsr0yiU", name: "Maverick Viñales", quote: "Feel the track before you ride it" },
  { id: "6", videoId: "nQbrjsr0yiU", name: "Fabio Quartararo", quote: "Building muscle memory for race day" },
  { id: "7", videoId: "nQbrjsr0yiU", name: "Joan Mir", quote: "The future of motorcycle training" },
  { id: "8", videoId: "nQbrjsr0yiU", name: "Pecco Bagnaia", quote: "Where champions are made" },
];

const customerVideos: Video[] = [
  { id: "1", videoId: "GANm4vmbvEA", name: "Ducati Corse Team", quote: "This is the real deal, incredible realism" },
  { id: "2", videoId: "lJYINxTIHeM", name: "Lorenzo Trastevere", quote: "World Champion Yamaha E-Sports" },
  { id: "3", videoId: "nQbrjsr0yiU", name: "Racing Enthusiast", quote: "Best investment I've ever made" },
  { id: "4", videoId: "nQbrjsr0yiU", name: "Event Attendee", quote: "I felt like I was actually racing" },
  { id: "5", videoId: "pDb6BUL9PcI", name: "Massimo - Ducati Corse", quote: "The closest thing to the real track" },
  { id: "6", videoId: "nQbrjsr0yiU", name: "Gaming Center Owner", quote: "Our customers can't get enough" },
  { id: "7", videoId: "nQbrjsr0yiU", name: "MotoGP Fan", quote: "Living my racing dreams" },
  { id: "8", videoId: "nQbrjsr0yiU", name: "First Time Rider", quote: "Absolutely mind-blowing experience" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Reviews = () => {
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showMoreProfessionals, setShowMoreProfessionals] = useState(false);
  const [showMoreCustomers, setShowMoreCustomers] = useState(false);
  const [loadedProfessionalVideos, setLoadedProfessionalVideos] = useState<Video[]>(professionalVideos);
  const [loadedCustomerVideos, setLoadedCustomerVideos] = useState<Video[]>(customerVideos);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch video titles on mount
  useEffect(() => {
    const fetchAllVideoInfo = async () => {
      setIsLoading(true);

      // Fetch professional videos info
      const professionalPromises = professionalVideos.map(async (video) => {
        const info = await fetchYouTubeVideoInfo(video.videoId);
        console.log(`Professional Video ${video.id}:`, { videoId: video.videoId, name: info.name, quote: info.quote });
        return {
          ...video,
          name: info.name,
          quote: info.quote
        };
      });

      // Fetch customer videos info
      const customerPromises = customerVideos.map(async (video) => {
        const info = await fetchYouTubeVideoInfo(video.videoId);
        console.log(`Customer Video ${video.id}:`, { videoId: video.videoId, name: info.name, quote: info.quote });
        return {
          ...video,
          name: info.name,
          quote: info.quote
        };
      });

      const [loadedPros, loadedCustomers] = await Promise.all([
        Promise.all(professionalPromises),
        Promise.all(customerPromises)
      ]);

      console.log('Loaded Professional Videos:', loadedPros);
      console.log('Loaded Customer Videos:', loadedCustomers);

      setLoadedProfessionalVideos(loadedPros);
      setLoadedCustomerVideos(loadedCustomers);
      setIsLoading(false);
    };

    fetchAllVideoInfo();
  }, []);

  const visibleProfessionalVideos = showMoreProfessionals ? loadedProfessionalVideos : loadedProfessionalVideos.slice(0, 6);
  const visibleCustomerVideos = showMoreCustomers ? loadedCustomerVideos : loadedCustomerVideos.slice(0, 6);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 font-inter">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <SpeedLines className="opacity-20" color="#a855f7" speed={0.5} />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black/50 to-black pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-300">Trusted by Pros & Enthusiasts</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold font-rajdhani mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                {t('reviews.title')}
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t('reviews.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <main className="pb-32 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="customers" className="w-full">
              <div className="flex justify-center mb-16">
                <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/5 border border-white/10 p-1 rounded-full">
                  <TabsTrigger
                    value="customers"
                    className="rounded-full data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-400 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {t('reviews.tabs.customers')}
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="professionals"
                    className="rounded-full data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      {t('reviews.tabs.professionals')}
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="customers" className="space-y-12">
                <div className="text-center mb-12">
                  <Quote className="w-12 h-12 text-cyan-500/20 mx-auto mb-4" />
                  <h2 className="text-3xl font-rajdhani font-bold text-white mb-2">Community Stories</h2>
                  <p className="text-gray-400">Real experiences from our events and customers</p>
                </div>

                <motion.div
                  variants={container}
                  initial={isLoading ? false : "hidden"}
                  whileInView="show"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {isLoading ? (
                    // Loading skeletons
                    Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="aspect-video bg-white/5 rounded-2xl animate-pulse" />
                    ))
                  ) : (
                    visibleCustomerVideos.map((video) => (
                      <motion.div key={video.id} variants={item}>
                        <VideoCard
                          videoId={video.videoId}
                          title={video.name}
                          quote={video.quote}
                          onClick={() => setSelectedVideo(video)}
                          className="hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]"
                        />
                      </motion.div>
                    ))
                  )}
                </motion.div>

                {!showMoreCustomers && customerVideos.length > 6 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="flex justify-center mt-12"
                  >
                    <Button
                      onClick={() => setShowMoreCustomers(true)}
                      variant="outline"
                      className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/30 hover:text-cyan-300 hover:border-cyan-500/60 px-8 py-6 rounded-full text-lg transition-all duration-300"
                    >
                      {t('reviews.showMore')}
                    </Button>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="professionals" className="space-y-12">
                <div className="text-center mb-12">
                  <Trophy className="w-12 h-12 text-purple-500/20 mx-auto mb-4" />
                  <h2 className="text-3xl font-rajdhani font-bold text-white mb-2">Pro Endorsements</h2>
                  <p className="text-gray-400">Trusted by the best riders in the world</p>
                </div>

                <motion.div
                  variants={container}
                  initial={isLoading ? false : "hidden"}
                  whileInView="show"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {isLoading ? (
                    // Loading skeletons
                    Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="aspect-video bg-white/5 rounded-2xl animate-pulse" />
                    ))
                  ) : (
                    visibleProfessionalVideos.map((video) => (
                      <motion.div key={video.id} variants={item}>
                        <VideoCard
                          videoId={video.videoId}
                          title={video.name}
                          quote={video.quote}
                          onClick={() => setSelectedVideo(video)}
                          className="hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)]"
                        />
                      </motion.div>
                    ))
                  )}
                </motion.div>

                {!showMoreProfessionals && professionalVideos.length > 6 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="flex justify-center mt-12"
                  >
                    <Button
                      onClick={() => setShowMoreProfessionals(true)}
                      variant="outline"
                      className="border-purple-500/30 text-purple-400 hover:bg-purple-950/30 hover:text-purple-300 hover:border-purple-500/60 px-8 py-6 rounded-full text-lg transition-all duration-300"
                    >
                      {t('reviews.showMore')}
                    </Button>
                  </motion.div>
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
