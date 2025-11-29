import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Helmet } from "react-helmet-async";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Box, Gamepad2, Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";

const VirtualReality = () => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white font-inter overflow-hidden">
            <Helmet>
                <title>{t('vr.title')} | DevotionSim</title>
                <meta name="description" content={t('vr.subtitle')} />
            </Helmet>
            <Navigation />

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div
                    style={{ y, opacity }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-black/80 to-black" />
                    {/* Abstract Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                </motion.div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h1 className="text-6xl md:text-8xl font-rajdhani font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-primary animate-pulse">
                            {t('vr.title')}
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
                    >
                        {t('vr.subtitle')}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        <Button size="lg" className="bg-primary hover:bg-primary/80 text-white px-8 py-6 text-lg rounded-full shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]">
                            {t('vr.cta')} <ArrowRight className="ml-2" />
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 relative z-10 bg-black">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <Box size={48} />,
                                title: t('vr.features.universal'),
                                desc: t('vr.features.universalDesc')
                            },
                            {
                                icon: <Gamepad2 size={48} />,
                                title: t('vr.features.gameReady'),
                                desc: t('vr.features.gameReadyDesc')
                            },
                            {
                                icon: <Monitor size={48} />,
                                title: t('vr.features.zeroLatency'),
                                desc: t('vr.features.zeroLatencyDesc')
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: idx * 0.2, duration: 0.6 }}
                                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 group"
                            >
                                <div className="mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-rajdhani font-bold mb-4">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Immersive Scroll Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/5 to-black" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-full md:w-1/2"
                        >
                            <h2 className="text-4xl md:text-6xl font-rajdhani font-bold mb-6">
                                {t('vr.immersion.title')} <span className="text-primary">{t('vr.immersion.highlight')}</span>
                            </h2>
                            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                                {t('vr.immersion.description')}
                            </p>
                            <ul className="space-y-4 text-gray-400">
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-primary rounded-full" />
                                    {t('vr.immersion.telemetry')}
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-primary rounded-full" />
                                    {t('vr.immersion.audio')}
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-primary rounded-full" />
                                    {t('vr.immersion.haptic')}
                                </li>
                            </ul>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-full md:w-1/2"
                        >
                            <div className="aspect-square rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center backdrop-blur-3xl border border-white/10 shadow-[0_0_100px_rgba(var(--primary),0.3)]">
                                {/* Placeholder for VR Headset Image */}
                                <span className="text-2xl font-rajdhani font-bold text-white/50">VR HEADSET VISUAL</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
            <LanguageSwitcher />
        </div>
    );
};

export default VirtualReality;
