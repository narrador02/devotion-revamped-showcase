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
        <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-gray-900 px-4">
            {/* Aspect-Locked Simulator Container (Square) */}
            <div className="relative h-[90vh] md:h-[95vh] aspect-square max-w-full flex items-center justify-center z-10">
                <motion.img
                    src={heroImg}
                    alt="MotoGP Simulator"
                    className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                />

                {/* Client Logo as Vinyl on Simulator - Pinned accurately with square grid */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="absolute right-[19.8%] top-[52.7%] -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center w-[15.5%] aspect-square"
                >
                    <img
                        src={clientLogoUrl}
                        alt={clientName}
                        className="max-w-full max-h-full object-contain opacity-95 filter brightness-110 contrast-110 drop-shadow-lg"
                    />
                </motion.div>

                {/* Content Bottom Platform */}
                <div className="absolute bottom-[10%] md:bottom-[14%] left-1/2 -translate-x-1/2 z-30 text-center w-full px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="uppercase tracking-[0.4em] text-white/50 text-[10px] md:text-xs font-semibold mb-3">
                            {t("proposal.hero.preparedFor", "Propuesta exclusiva para")}
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white tracking-[0.05em] uppercase mb-4 drop-shadow-2xl">
                            {clientName}
                        </h1>

                        <div className="h-[2px] w-12 bg-red-600 mx-auto rounded-full" />
                    </motion.div>
                </div>
            </div>

            {/* Background Image (Blurred for Depth) */}
            <div className="absolute inset-0 z-0 opacity-20 filter blur-xl">
                <img src={heroImg} alt="" className="w-full h-full object-cover" />
            </div>

            {/* Top Subtitle */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-[8%] md:top-[12%] left-1/2 -translate-x-1/2 z-40 w-full text-center px-4"
            >
                <p className="text-[10px] md:text-xs lg:text-sm text-white/30 font-medium tracking-[0.5em] uppercase whitespace-nowrap drop-shadow-sm">
                    {t("proposal.hero.subtitle", "Descubre la experiencia de simulación definitiva para tu evento.")}
                </p>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 z-20 cursor-pointer"
                onClick={scrollToContent}
            >
                <div className="flex flex-col items-center gap-2 text-gray-400/50 hover:text-white transition-colors">
                    <span className="text-[9px] uppercase tracking-[0.3em]">{t("common.scroll", "Scroll")}</span>
                    <ArrowDown className="w-4 h-4" />
                </div>
            </motion.div>
        </div>
    );
}
