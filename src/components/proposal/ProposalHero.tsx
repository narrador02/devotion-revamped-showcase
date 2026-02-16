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

            {/* Content */}
            <div className="relative z-20 text-center space-y-8 px-4 max-w-4xl mx-auto mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <div className="uppercase tracking-[0.2em] text-white/90 text-sm md:text-base font-medium drop-shadow-md">
                        {t("proposal.hero.preparedFor", "Prepared exclusively for")}
                    </div>

                    <div className="flex justify-center">
                        <div className="inline-flex bg-white/5 backdrop-blur-xl rounded-2xl p-16 md:p-24 border border-white/20 shadow-2xl transition-all duration-300">
                            <img
                                src={clientLogoUrl}
                                alt={clientName}
                                className="max-w-[240px] md:max-w-[320px] max-h-[120px] md:max-h-[160px] w-auto h-auto object-contain drop-shadow-xl"
                            />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
                        {clientName}
                    </h1>

                    <div className="h-1 w-24 bg-red-600 mx-auto rounded-full" />

                    <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
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
