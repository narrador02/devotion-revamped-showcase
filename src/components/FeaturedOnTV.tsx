import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ExternalLink, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import hormigueroSimulator from "@/assets/hormiguero-simulator.png";

const FeaturedOnTV = () => {
    const { t } = useTranslation();

    return (
        <section className="py-12 md:py-20 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
            {/* Subtle background accent */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-12 items-center"
                >
                    {/* Text Content - Left */}
                    <div className="order-2 lg:order-1">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                            <Tv className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">TV Nacional</span>
                        </div>

                        {/* Headline */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-rajdhani font-bold text-foreground mb-4 leading-tight">
                            {t('featuredOnTV.headline')}
                        </h2>

                        {/* Body text */}
                        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8">
                            {t('featuredOnTV.body')}
                        </p>

                        {/* CTA Button */}
                        <Button
                            asChild
                            size="lg"
                            className="bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white px-6 py-6 text-base rounded-full shadow-lg hover:shadow-primary/30 transition-all duration-300 gap-2"
                        >
                            <a
                                href="https://amp.antena3.com/programas/el-hormiguero/increible-oscar-casas-humilla-ana-mena-simulador-motogp_20260120696ffb6bf21351044da3753b.html"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t('featuredOnTV.cta')}
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </Button>
                    </div>

                    {/* Image Slot - Right */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="order-1 lg:order-2 flex justify-center lg:justify-end"
                    >
                        <div className="relative w-full max-w-md lg:max-w-lg">
                            {/* Decorative glow behind image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-2xl blur-3xl transform scale-110 opacity-50" />

                            {/* Image container */}
                            <div className="relative bg-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-4 md:p-8 shadow-[0_0_40px_rgba(239,68,68,0.15)] overflow-hidden">
                                <img
                                    src={hormigueroSimulator}
                                    alt={t('featuredOnTV.imageAlt')}
                                    className="w-full h-auto object-cover rounded-lg shadow-sm"
                                />
                                {/* TV Show branding text */}
                                <div className="text-center mt-4">
                                    <p className="text-lg font-rajdhani font-bold text-foreground">El Hormiguero</p>
                                    <p className="text-sm text-muted-foreground">Antena 3</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedOnTV;
