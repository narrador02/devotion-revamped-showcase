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
        <div className="relative h-screen w-full overflow-hidden bg-gray-900">
            {/* Full-bleed simulator image */}
            <motion.img
                src={heroImg}
                alt="MotoGP Simulator"
                className="absolute inset-0 w-full h-full object-cover object-center"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2 }}
            />

            {/*
              Client Logo — pinned to the white square on the right cylinder face.
              Outer div handles position/centering. Inner motion.div handles animation only
              so Framer Motion never overrides the translateY(-50%) centering.

              White box reference coordinates (from 1024×1024 image, object-cover landscape):
                - Center X: ~77% from left → right: ~12.5% (element right edge)
                - Center Y: ~52% from top
                - Box width: ~21% of image → logo fits inside at 15%
            */}
            <div
                className="absolute z-20 pointer-events-none"
                style={{
                    right: "10.5%",
                    top: "52%",
                    transform: "translateY(-50%)",
                    width: "9.7%",
                    aspectRatio: "1 / 1",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="w-full h-full flex items-center justify-center"
                >
                    <img
                        src={clientLogoUrl}
                        alt={clientName}
                        className="max-w-full max-h-full object-contain opacity-95"
                        style={{
                            filter: "brightness(1.1) contrast(1.05) drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
                        }}
                    />
                </motion.div>
            </div>

            {/* Top subtitle — matches the original barely-visible uppercase style */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-[4%] md:top-[7%] left-1/2 -translate-x-1/2 z-20 w-full text-center px-4"
            >
                <p className="text-[10px] md:text-sm text-gray-600 font-medium tracking-[0.1em] md:tracking-[0.5em] uppercase">
                    {t("proposal.hero.subtitle", "Descubre la experiencia de simulación definitiva para tu evento.")}
                </p>
            </motion.div>

            {/* Client name — bottom of image */}
            <div className="absolute bottom-[14%] md:bottom-[18%] left-1/2 -translate-x-1/2 z-20 text-center w-full px-4">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="uppercase tracking-[0.4em] text-white/60 text-[10px] md:text-xs font-medium mb-2">
                        {t("proposal.hero.preparedFor", "Propuesta exclusiva para")}
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white tracking-[0.05em] uppercase mb-3 drop-shadow-2xl">
                        {clientName}
                    </h1>

                    <div className="h-[2px] w-12 bg-red-600 mx-auto rounded-full" />
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
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
