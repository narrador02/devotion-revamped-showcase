import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SEO from "@/components/SEO";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    Zap,
    Move3d,
    Activity,
    Volume2,
    Globe,
    Headphones,
    HandMetal,
    CheckCircle2,
    Calendar,
    Gamepad,
    Presentation,
    GraduationCap
} from "lucide-react";
import { useTranslation } from "react-i18next";
import SpeedLines from "@/components/SpeedLines";
import { useRouteScroll } from "@/hooks/useRouteScroll";

// HERO BG
import vrBg from "@/assets/vr-img.webp";
import vrImmersive from "@/assets/vr-immersive.jpg";

// GAMES
import motogp25Logo from "@/assets/game-motogp25.png";
import ride5Logo from "@/assets/game-ride5.png";
import gpbikesLogo from "@/assets/game-gpbikes.png";

// VR HEADSETS
import quest3 from "@/assets/vr-quest3.png";
import psvr2 from "@/assets/vr-psvr2.png";
import pico4 from "@/assets/vr-pico4.png";
import hpReverb from "@/assets/vr-hpreverb.png";

const VirtualReality = () => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "50%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const bgY = useTransform(scrollYProgress, [0, 0.3], ["0%", "12%"]);

    useRouteScroll({
        '/virtual-reality': 'vr-hero',
        '/virtual-reality/headsets': 'headsets'
    });

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-black text-white font-inter overflow-x-hidden scroll-smooth selection:bg-cyan-500/30"
        >
            <SEO
                title={t("seo.vr.title")}
                description={t("seo.vr.description")}
                keywords={t("seo.vr.keywords")}
                path="/virtual-reality"
            />

            <Navigation />

            {/* ================= HERO ================= */}
            <section id="vr-hero" className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <motion.img
                        src={vrBg}
                        alt="VR Motorcycle Simulation"
                        style={{ y: bgY }}
                        className="w-full h-full object-cover object-[center_30%] md:object-center scale-110"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
                </div>

                <SpeedLines className="z-0 opacity-30" color="#06b6d4" speed={2} density={30} />

                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-[calc(env(safe-area-inset-top)+4rem)]"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl sm:text-6xl md:text-8xl font-rajdhani font-bold mb-6 tracking-tight"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-purple-500 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                            {t("vr_page.hero.title")}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto font-light"
                    >
                        {t("vr_page.hero.subtitle")}
                    </motion.p>
                </motion.div>

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-black z-10 pointer-events-none" />
            </section>

            {/* ================= COMPATIBLE GAMES ================= */}
            <section className="py-1 mb-20 bg-black">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-rajdhani font-bold mb-4">
                        {t("vr_page.compatibility.title")}
                    </h2>
                    <p className="text-gray-400 text-lg mb-10 max-w-4xl mx-auto">
                        {t("vr_page.compatibility.description")}
                    </p>

                    {/* Compatibility Badges */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
                        {[
                            { key: "motogp", color: "border-cyan-500/50 text-cyan-400" },
                            { key: "racing", color: "border-purple-500/50 text-purple-400" },
                            { key: "sims", color: "border-white/30 text-white" }
                        ].map((badge, idx) => (
                            <div
                                key={idx}
                                className={`py-4 px-4 rounded-xl border ${badge.color} bg-white/5 flex items-center justify-center gap-3`}
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-bold tracking-wide">
                                    {t(`vr_page.compatibility.badges.${badge.key}`)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Game Images with Steam Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {[
                            { logo: motogp25Logo, name: "MotoGP 25", url: "https://store.steampowered.com/app/3077390/MotoGP25/" },
                            { logo: ride5Logo, name: "RIDE 5", url: "https://store.steampowered.com/app/1650010/RIDE_5/" },
                            { logo: gpbikesLogo, name: "GP Bikes", url: "https://store.steampowered.com/app/848050/GP_Bikes/" }
                        ].map((game, i) => (
                            <a
                                key={i}
                                href={game.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="aspect-[3/2] bg-white/5 rounded-xl flex items-center justify-center border border-white/5 hover:border-cyan-500/40 hover:bg-white/10 transition-all overflow-hidden cursor-pointer group"
                            >
                                <img
                                    src={game.logo}
                                    alt={game.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                    loading="lazy"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= VR HEADSETS ================= */}
            <section id="headsets" className="py-1 md:py-20 bg-black">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-rajdhani font-bold mb-4">
                        {t("vr_page.headsets.title")}
                    </h2>
                    <p className="text-gray-400 text-lg mb-12 max-w-4xl mx-auto">
                        {t("vr_page.headsets.subtitle")}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {[
                            { logo: quest3, name: "Meta Quest 3", url: "https://www.meta.com/quest/quest-3/" },
                            { logo: psvr2, name: "PlayStation VR2", url: "https://www.playstation.com/ps-vr2/" },
                            { logo: pico4, name: "PICO 4", url: "https://www.picoxr.com/global/products/pico4" },
                            { logo: hpReverb, name: "HP Reverb G2", url: "https://www.hp.com/es-es/shop/offer.aspx?p=hp-reverb-g2-vr-headset&msockid=3c92455a3dd463f20e0756c83c7c621b" }
                        ].map((headset, i) => (
                            <a
                                key={i}
                                href={headset.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="aspect-[3/2] bg-white/5 rounded-xl flex items-center justify-center border border-white/5 hover:border-purple-500/40 hover:bg-white/10 transition-all overflow-hidden cursor-pointer group"
                            >
                                <img
                                    src={headset.logo}
                                    alt={headset.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                    loading="lazy"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= IMMERSIVE EXPERIENCE ================= */}
            <section className="py-32 relative overflow-hidden bg-gradient-to-b from-black to-gray-950">
                <SpeedLines className="opacity-10" density={10} speed={0.5} />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                            >
                                <h2 className="text-4xl md:text-5xl font-rajdhani font-bold mb-8 leading-tight">
                                    {t("vr_page.immersion.title")}
                                </h2>

                                <p className="text-lg text-gray-300 mb-10 leading-relaxed border-l-4 border-cyan-500 pl-6">
                                    {t("vr_page.immersion.description")}
                                </p>

                                <div className="space-y-6">
                                    {[
                                        { icon: <Globe className="w-6 h-6 text-cyan-400" />, key: "env360" },
                                        { icon: <Headphones className="w-6 h-6 text-purple-400" />, key: "spatialAudio" },
                                        { icon: <HandMetal className="w-6 h-6 text-cyan-400" />, key: "naturalInteraction" }
                                    ].map((feat, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + idx * 0.1 }}
                                            className="flex items-start gap-4"
                                        >
                                            <div className="mt-1 p-2 bg-white/5 rounded-lg">
                                                {feat.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white mb-1">
                                                    {t(`vr_page.immersion.features.${feat.key}.title`)}
                                                </h4>
                                                <p className="text-gray-400 text-sm">
                                                    {t(`vr_page.immersion.features.${feat.key}.desc`)}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <div className="w-full lg:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative aspect-square rounded-3xl overflow-hidden border border-white/10"
                            >
                                <img
                                    src={vrImmersive}
                                    alt="VR Immersive Experience"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= USE CASES ================= */}
            <section className="py-1 md:py-12 bg-black">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-rajdhani font-bold text-center mb-16">
                        {t("vr_page.useCases.title")}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <Calendar />, key: "events", color: "text-purple-400" },
                            { icon: <Gamepad />, key: "centers", color: "text-cyan-400" },
                            { icon: <Presentation />, key: "marketing", color: "text-pink-400" },
                            { icon: <GraduationCap />, key: "training", color: "text-green-400" }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`${item.color} w-8 h-8 shrink-0`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold">
                                        {t(`vr_page.useCases.cards.${item.key}.title`)}
                                    </h3>
                                </div>
                                <p className="text-gray-400 text-base">
                                    {t(`vr_page.useCases.cards.${item.key}.desc`)}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= HOW IT WORKS ================= */}
            <section className="py-10 md:py-20 bg-gray-950">
                <div className="container mx-auto px-4">
                    <motion.h2 className="text-4xl md:text-5xl font-rajdhani font-bold text-center mb-20">
                        {t("vr_page.howItWorks.title")}
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {["1", "2", "3"].map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 mx-auto border-2 border-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold text-cyan-400 mb-6">
                                    {step.padStart(2, "0")}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">
                                    {t(`vr_page.howItWorks.steps.${step}.title`)}
                                </h3>
                                <p className="text-gray-400">
                                    {t(`vr_page.howItWorks.steps.${step}.desc`)}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="py-10 md:py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-black" />
                <SpeedLines className="opacity-20" color="#a855f7" speed={3} />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-7xl font-rajdhani font-bold mb-8">
                            {t("vr_page.cta.title")}
                        </h2>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <Link to="/contact">
                                <Button
                                    size="lg"
                                    className="bg-white text-black hover:bg-gray-200 px-10 py-7 text-lg rounded-full font-bold hover:scale-105 transition-transform"
                                >
                                    {t("vr_page.cta.button")}
                                </Button>
                            </Link>

                            <Link to="/simulators" className="text-gray-400 hover:text-white underline-offset-4 hover:underline">
                                {t("vr_page.cta.link")}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
            <LanguageSwitcher />
        </div>
    );
};

export default VirtualReality;
