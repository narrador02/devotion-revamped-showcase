import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SpeedLines from "@/components/SpeedLines";
import CountUpMetric from "@/components/CountUpMetric";
import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import { Button } from "@/components/ui/button";

// Sample event data - replace with real data
const sampleEvents = [
  {
    id: "1",
    name: "Gran Premio de España – Fan Zone VR",
    type: 'motogp' as const,
    year: 2024,
    location: "Jerez, España",
    client: "MotoGP",
    description: "Simuladores de moto presentes en la Fan Zone del Gran Premio de España en Jerez.",
    setup: {
      simulators: 4,
      models: ["Slady Pro", "Slady Racing"],
      duration: "4 días",
      configuration: "Configuración especial para MotoGP con contenido exclusivo"
    },
    experience: "Miles de aficionados pudieron experimentar la adrenalina de conducir una moto de MotoGP en nuestros simuladores. Las colas fueron constantes durante todo el evento, con participantes de todas las edades disfrutando de la experiencia VR.",
    results: {
      participants: 2500,
      highlights: [
        "Actividad constante durante las 4 jornadas",
        "Rankings diarios con premios para los mejores tiempos",
        "Excelente feedback de los visitantes"
      ]
    }
  },
  {
    id: "2",
    name: "MotoGP Misano – Paddock Experience",
    type: 'motogp' as const,
    year: 2024,
    location: "Misano, Italia",
    client: "MotoGP",
    description: "Presencia en el paddock del Gran Premio de San Marino.",
    setup: {
      simulators: 3,
      models: ["Slady Pro"],
      duration: "3 días"
    },
    experience: "Experiencia premium en el paddock con simuladores de última generación.",
    results: {
      participants: 1800,
      highlights: [
        "Acceso exclusivo al paddock",
        "Participación de pilotos profesionales",
        "Cobertura mediática internacional"
      ]
    }
  },
  {
    id: "3",
    name: "Evento Corporativo Yamaha",
    type: 'corporate' as const,
    year: 2023,
    location: "Barcelona, España",
    client: "Yamaha Motor",
    description: "Activación corporativa para el lanzamiento de nuevos modelos.",
    setup: {
      simulators: 2,
      models: ["Slady Racing"],
      duration: "2 días"
    },
    experience: "Evento exclusivo para distribuidores y prensa especializada.",
    results: {
      participants: 450,
      highlights: [
        "Demos personalizadas",
        "Contenido exclusivo de Yamaha",
        "Alta satisfacción de participantes"
      ]
    }
  },
  {
    id: "4",
    name: "Smart City Expo 2023",
    type: 'expo' as const,
    year: 2023,
    location: "Barcelona, España",
    client: "Fira Barcelona",
    description: "Presencia en la feria Smart City Expo mostrando tecnología VR.",
    setup: {
      simulators: 5,
      models: ["Slady Pro", "Slady Racing", "Slady Basic"],
      duration: "3 días"
    },
    experience: "Gran afluencia de público profesional interesado en soluciones tecnológicas.",
    results: {
      participants: 3200,
      highlights: [
        "Más de 3000 participantes",
        "Generación de leads cualificados",
        "Cobertura en medios especializados"
      ]
    }
  }
];

const Events = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'motogp' | 'corporate' | 'expo'>('all');
  const [selectedEvent, setSelectedEvent] = useState<typeof sampleEvents[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters = [
    { id: 'all' as const, label: t('events.filters.all') },
    { id: 'motogp' as const, label: t('events.filters.motogp') },
    { id: 'corporate' as const, label: t('events.filters.corporate') },
    { id: 'expo' as const, label: t('events.filters.expo') }
  ];

  const filteredEvents = selectedFilter === 'all'
    ? sampleEvents
    : sampleEvents.filter(e => e.type === selectedFilter);

  const handleEventClick = (event: typeof sampleEvents[0]) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

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

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <Navigation />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <SpeedLines className="opacity-20" color="#ef4444" speed={0.5} />
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 via-black/50 to-black pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold font-rajdhani mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                {t('events.hero.title')}
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {t('events.hero.subtitle')}
            </p>
          </motion.div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-12">
            <CountUpMetric end={380} prefix="+" label={t('events.metrics.grandPrix')} />
            <CountUpMetric end={470} prefix="+" label={t('events.metrics.totalEvents')} />
            <CountUpMetric end={28000} prefix="+" label={t('events.metrics.participants')} />
            <CountUpMetric end={2017} label={t('events.metrics.since')} />
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex justify-center"
          >
            <ChevronDown className="w-6 h-6 text-gray-500" />
          </motion.div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${selectedFilter === filter.id
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* EVENTS GRID */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            key={selectedFilter}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          >
            {filteredEvents.map((event) => (
              <motion.div key={event.id} variants={item}>
                <EventCard
                  {...event}
                  onClick={() => handleEventClick(event)}
                />
              </motion.div>
            ))}
          </motion.div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p>{t('events.noEvents')}</p>
            </div>
          )}
        </div>
      </section>

      {/* MOTOGP SHOWCASE */}
      <section className="py-20 bg-gradient-to-br from-red-950/20 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzFmMjkzNyIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-400">{t('events.partnership')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-rajdhani mb-4">
              {t('events.motogp.title')}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('events.motogp.subtitle')}
            </p>
          </motion.div>

          <div className="overflow-x-auto pb-8 -mx-4 px-4">
            <div className="flex gap-4 min-w-max">
              {['Jerez', 'Barcelona', 'Mugello', 'Assen', 'Sachsenring', 'Silverstone', 'Misano', 'Aragón', 'Valencia'].map((gp, idx) => (
                <motion.div
                  key={gp}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="flex-shrink-0 w-48 p-6 bg-white/5 border border-white/10 rounded-xl hover:border-red-500/50 transition-all cursor-pointer"
                >
                  <div className="text-2xl font-bold font-rajdhani text-white mb-2">{gp}</div>
                  <div className="text-sm text-gray-400">{t('events.grandPrix')}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-black to-black" />
        <SpeedLines className="opacity-10" color="#ef4444" speed={0.3} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-rajdhani mb-6">
              {t('events.cta.title')}
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              {t('events.cta.subtitle')}
            </p>
            <Button
              onClick={() => navigate('/rent-purchase')}
              size="lg"
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300"
            >
              {t('events.cta.button')}
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <LanguageSwitcher />

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setSelectedEvent(null), 300);
        }}
      />
    </div>
  );
};

export default Events;
