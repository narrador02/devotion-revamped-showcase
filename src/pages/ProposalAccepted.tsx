import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

export default function ProposalAccepted() {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>DevotionSim – {t("proposalAccepted.title", "Propuesta Aceptada")}</title>
            </Helmet>

            <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">

                {/* Ambient glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-600/5 blur-[120px]" />
                </div>

                <div className="relative max-w-lg w-full text-center space-y-10">

                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <img
                            src="/logo.png"
                            alt="DevotionSim"
                            className="h-12 mx-auto brightness-0 invert opacity-90"
                        />
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-px bg-gradient-to-r from-transparent via-red-600/60 to-transparent"
                    />

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                        className="space-y-5"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white font-rajdhani leading-tight">
                            {t("proposalAccepted.heading")}
                        </h1>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            {t("proposalAccepted.message")}
                        </p>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"
                    />

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="text-gray-600 text-sm uppercase tracking-widest"
                    >
                        {t("proposalAccepted.tagline")}
                    </motion.p>
                </div>
            </div>
        </>
    );
}
