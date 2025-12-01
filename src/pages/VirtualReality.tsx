import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Helmet } from "react-helmet-async";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Move3d, Activity, Volume2, Globe, Headphones, HandMetal, CheckCircle2, Calendar, Gamepad, Presentation, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import SpeedLines from "@/components/SpeedLines";

const VirtualReality = () => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "50%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white font-inter overflow-x-hidden selection:bg-cyan-500/30">
            <Helmet>
                <title>{t('vr_page.hero.title')} | DevotionSim</title>
                <meta name="description" content={t('vr_page.hero.subtitle')} />
            </Helmet>
            <Navigation />

            {/* HERO SECTION */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <SpeedLines className="z-0 opacity-40" color="#06b6d4" speed={2} density={30} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-0 pointer-events-none" />

                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="relative z-10 text-center px-4 max-w-5xl mx-auto"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-6xl md:text-8xl font-rajdhani font-bold mb-6 tracking-tight"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-purple-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            {t('vr_page.hero.title')}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light"
                    >
                        {t('vr_page.hero.subtitle')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-7 text-lg rounded-full shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] transition-all duration-300 hover:scale-105 group">
                            {t('vr_page.hero.cta')} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            {/* SENSATIONS SECTION */}
            <section className="py-32 relative z-10 bg-black">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent" />
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-rajdhani font-bold text-center mb-20 text-white"
                    >
                        {t('vr_page.sensations.title')}
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Zap className="w-10 h-10 text-cyan-400" />,
                                title: t('vr_page.sensations.speed.title'),
                                desc: t('vr_page.sensations.speed.desc')
                            },
                            {
                                icon: <Move3d className="w-10 h-10 text-purple-400" />,
                                title: t('vr_page.sensations.lean.title'),
                                desc: t('vr_page.sensations.lean.desc')
                            },
                            {
                                icon: <Activity className="w-10 h-10 text-cyan-400" />,
                                title: t('vr_page.sensations.vibration.title'),
                                desc: t('vr_page.sensations.vibration.desc')
                            },
                            {
                                icon: <Volume2 className="w-10 h-10 text-purple-400" />,
                                title: t('vr_page.sensations.sound.title'),
                                desc: t('vr_page.sensations.sound.desc')
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/10 transition-all duration-300 group"
                            >
                                <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_-5px_rgba(255,255,255,0.1)]">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-rajdhani font-bold mb-3 text-gray-100">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* IMMERSIVE EXPERIENCE SECTION */}
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
                                    {t('vr_page.immersion.title')}
                                </h2>
                                <p className="text-lg text-gray-300 mb-10 leading-relaxed border-l-4 border-cyan-500 pl-6">
                                    {t('vr_page.immersion.description')}
                                </p>

                                <div className="space-y-6">
                                    {[
                                        {
                                            icon: <Globe className="w-6 h-6 text-cyan-400" />,
                                            title: t('vr_page.immersion.features.env360.title'),
                                            desc: t('vr_page.immersion.features.env360.desc')
                                        },
                                        {
                                            icon: <Headphones className="w-6 h-6 text-purple-400" />,
                                            title: t('vr_page.immersion.features.spatialAudio.title'),
                                            desc: t('vr_page.immersion.features.spatialAudio.desc')
                                        },
                                        {
                                            icon: <HandMetal className="w-6 h-6 text-cyan-400" />,
                                            title: t('vr_page.immersion.features.naturalInteraction.title'),
                                            desc: t('vr_page.immersion.features.naturalInteraction.desc')
                                        }
                                    ].map((feat, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + (idx * 0.1) }}
                                            className="flex items-start gap-4"
                                        >
                                            <div className="mt-1 p-2 bg-white/5 rounded-lg">{feat.icon}</div>
                                            <div>
                                                <h4 className="font-bold text-white mb-1">{feat.title}</h4>
                                                <p className="text-gray-400 text-sm">{feat.desc}</p>
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
                                className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 flex items-center justify-center group"
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                                <div className="text-center p-8">
                                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)] animate-pulse">
                                        <span className="text-4xl">🕶️</span>
                                    </div>
                                    <p className="text-gray-500 font-rajdhani uppercase tracking-widest text-sm">Visual Placeholder</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMPATIBILITY SECTION */}
            <section className="py-32 relative bg-black">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-rajdhani font-bold mb-6">{t('vr_page.compatibility.title')}</h2>
                        <p className="text-gray-400 text-lg">{t('vr_page.compatibility.description')}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {[
                            { label: t('vr_page.compatibility.badges.motogp'), color: "border-cyan-500/50 text-cyan-400" },
                            { label: t('vr_page.compatibility.badges.racing'), color: "border-purple-500/50 text-purple-400" },
                            { label: t('vr_page.compatibility.badges.sims'), color: "border-white/30 text-white" }
                        ].map((badge, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`py-6 px-4 rounded-xl border ${badge.color} bg-white/5 backdrop-blur-sm flex items-center justify-center gap-3`}
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-bold tracking-wide">{badge.label}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-30">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-20 bg-white/5 rounded-lg flex items-center justify-center border border-white/5">
                                <span className="text-xs text-gray-500">LOGO GAME {i}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="py-32 relative bg-gray-950 overflow-hidden">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-rajdhani font-bold text-center mb-20"
                    >
                        {t('vr_page.howItWorks.title')}
                    </motion.h2>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-900 to-transparent -translate-y-1/2 z-0" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                            {[
                                { step: "01", title: t('vr_page.howItWorks.steps.1.title'), desc: t('vr_page.howItWorks.steps.1.desc') },
                                { step: "02", title: t('vr_page.howItWorks.steps.2.title'), desc: t('vr_page.howItWorks.steps.2.desc') },
                                { step: "03", title: t('vr_page.howItWorks.steps.3.title'), desc: t('vr_page.howItWorks.steps.3.desc') }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="text-center group"
                                >
                                    <div className="w-20 h-20 mx-auto bg-black border-2 border-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold text-cyan-400 mb-6 shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-110 transition-transform duration-300 relative z-10">
                                        {item.step}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-gray-400">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* USE CASES SECTION */}
            <section className="py-32 bg-black relative">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-rajdhani font-bold text-center mb-16">
                        {t('vr_page.useCases.title')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <Calendar />, key: 'events', color: 'text-purple-400' },
                            { icon: <Gamepad />, key: 'centers', color: 'text-cyan-400' },
                            { icon: <Presentation />, key: 'marketing', color: 'text-pink-400' },
                            { icon: <GraduationCap />, key: 'training', color: 'text-green-400' }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/5 p-8 rounded-2xl hover:bg-white/10 transition-colors duration-300 border border-transparent hover:border-white/10"
                            >
                                <div className={`mb-6 ${item.color} w-10 h-10`}>{item.icon}</div>
                                <h3 className="text-xl font-bold mb-3">{t(`vr_page.useCases.cards.${item.key}.title`)}</h3>
                                <p className="text-gray-400 text-sm">{t(`vr_page.useCases.cards.${item.key}.desc`)}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-black" />
                <SpeedLines className="opacity-20" color="#a855f7" speed={3} />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-7xl font-rajdhani font-bold mb-8 text-white">
                            {t('vr_page.cta.title')}
                        </h2>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-10 py-7 text-lg rounded-full font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:scale-105 transition-transform duration-300">
                                {t('vr_page.cta.button')}
                            </Button>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors underline-offset-4 hover:underline">
                                {t('vr_page.cta.link')}
                            </a>
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
