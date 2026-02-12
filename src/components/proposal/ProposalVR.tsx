import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Headset, Play, Sparkles } from "lucide-react";
import vrImmersive from "@/assets/vr-immersive.jpg";

export default function ProposalVR() {
    const { t } = useTranslation();

    return (
        <div className="py-24 bg-gradient-to-b from-black to-gray-900 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center border border-red-600/20">
                            <Headset className="w-6 h-6 text-red-500" />
                        </div>
                        <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">
                            {t("proposal.vr.badge", "Next Gen Immersion")}
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        {t("proposal.vr.title", "Virtual Reality")} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                            {t("proposal.vr.titleHighlight", "Like Never Before")}
                        </span>
                    </h2>

                    <p className="text-gray-400 text-lg leading-relaxed">
                        {t("proposal.vr.description", "Step inside the helmet of a professional rider. Our VR integration provides unmatched depth perception and speed sensation.")}
                    </p>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-white font-medium">
                                <Sparkles className="w-4 h-4 text-red-500" />
                                {t("proposal.vr.resolution", "4K Resolution")}
                            </div>
                            <p className="text-sm text-gray-500">{t("proposal.vr.resDesc", "Crystal clear optics")}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-white font-medium">
                                <Play className="w-4 h-4 text-red-500" />
                                {t("proposal.vr.refresh", "120Hz Refresh Rate")}
                            </div>
                            <p className="text-sm text-gray-500">{t("proposal.vr.refreshDesc", "Butter smooth motion")}</p>
                        </div>
                    </div>

                    <p className="text-gray-500 text-sm italic pt-4">
                        {t("proposal.vr.availability", "Consult us for VR headset availability")}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent blur-3xl -z-10" />
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-2xl group">
                        <img
                            src={vrImmersive}
                            alt="VR Experience"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Overlay removed as requested */}
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-red-400 font-medium tracking-wide">{t("proposal.vr.edition", "Enterprise Edition")}</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
