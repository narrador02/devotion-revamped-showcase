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
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute right-[5%] md:right-[12%] top-[35%] z-20 pointer-events-none"
            >
                <img
                    src={clientLogoUrl}
                    alt={clientName}
                    className="w-[180px] md:w-[280px] lg:w-[320px] h-auto object-contain opacity-90 drop-shadow-2xl filter brightness-110 contrast-110"
                    style={{
                        transform: "perspective(1000px) rotateY(-15deg) rotateX(5deg) skewY(-2deg)",
                    }}
                />
            </motion.div>

            {/* Content Bottom Platform */}
            <div className="absolute bottom-[15%] md:bottom-[18%] left-1/2 -translate-x-1/2 z-20 text-center w-full px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="uppercase tracking-[0.3em] text-white/70 text-[10px] md:text-sm font-light mb-2">
                        {t("proposal.hero.preparedFor", "Prepared exclusively for")}
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-widest uppercase mb-6 drop-shadow-2xl">
                        {clientName}
                    </h1>

                    <div className="h-[2px] w-16 bg-red-600 mx-auto rounded-full mb-8" />

                    <p className="hidden md:block text-sm md:text-base text-gray-400 font-light tracking-wide max-w-xl mx-auto uppercase">
                        {t("proposal.hero.subtitle", "Discover the ultimate simulation experience for your event.")}
                    </p>
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
