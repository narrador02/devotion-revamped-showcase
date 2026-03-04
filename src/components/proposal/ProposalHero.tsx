import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowDown } from "lucide-react";
import heroImg from "@/assets/hero-motorcycle.png";

interface ProposalHeroProps {
    clientName: string;
    clientLogoUrl: string;
}

export default function ProposalHero({ clientName, clientLogoUrl }: ProposalHeroProps) {
    const { t } = useTranslation();

    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth"
        });
    };

    return (
        <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-gray-900">
            {/* Image Background (Replaces Video) */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src={heroImg}
                    alt="Simulation Experience"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Client Logo as Vinyl on Simulator */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute right-[5%] md:right-[8%] top-[40%] md:top-[45%] z-20 pointer-events-none"
            >
                <img
                    src={clientLogoUrl}
                    alt={clientName}
                    className="w-[140px] md:w-[220px] lg:w-[260px] h-auto object-contain opacity-95 drop-shadow-2xl filter brightness-110 contrast-110"
                />
            </motion.div>

            {/* Top Subtitle */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-[18%] md:top-[22%] left-1/2 -translate-x-1/2 z-20 w-full text-center px-4"
            >
                <p className="text-[10px] md:text-sm lg:text-base text-white/60 font-medium tracking-[0.3em] uppercase whitespace-nowrap overflow-hidden">
                    {t("proposal.hero.subtitle", "Descubre la experiencia de simulación definitiva para tu evento.")}
                </p>
            </motion.div>

            {/* Content Bottom Platform */}
            <div className="absolute bottom-[8%] md:bottom-[10%] left-1/2 -translate-x-1/2 z-20 text-center w-full px-4">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="uppercase tracking-[0.4em] text-white/80 text-[10px] md:text-xs font-medium mb-3">
                        {t("proposal.hero.preparedFor", "Propuesta exclusiva para")}
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white tracking-[0.1em] uppercase mb-2 drop-shadow-2xl">
                        {clientName}
                    </h1>

                    <div className="h-[2px] w-16 bg-red-600 mx-auto rounded-full mb-4" />
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 z-20 cursor-pointer"
                onClick={scrollToContent}
            >
                <div className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <span className="text-xs uppercase tracking-widest">{t("common.scroll", "Scroll")}</span>
                    <ArrowDown className="w-6 h-6" />
                </div>
            </motion.div>
        </div>
    );
}
