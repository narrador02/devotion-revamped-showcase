import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Gauge, Flag, Trophy } from "lucide-react";

import videoTimeAttack from "@/assets/eje2-wheelie.mp4";
import videoSlady from "@/assets/eje3-desliz.mp4";
import videoTopGun from "@/assets/eje4-aceler.mp4";

export default function ProposalExperience() {
    const { t } = useTranslation();

    const experiences = [
        {
            id: 1,
            title: "Realism",
            subtitle: "Physics & Feedback",
            video: videoTimeAttack,
            icon: Gauge,
        },
        {
            id: 2,
            title: "Immersion",
            subtitle: "VR & Surround",
            video: videoSlady,
            icon: Flag,
        },
        {
            id: 3,
            title: "Competition",
            subtitle: "Live Telemetry",
            video: videoTopGun,
            icon: Trophy,
        },
    ];

    return (
        <div className="py-24 bg-black relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white tracking-tight"
                    >
                        {t("proposal.experience.title", "The Devotion Experience")}
                    </motion.h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {t("proposal.experience.subtitle", "Professional grade simulation technology tailored for your event.")}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <Card className="bg-gray-900 overflow-hidden border-gray-800 hover:border-red-600/50 transition-colors group">
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                                    <video
                                        src={exp.video}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent z-20">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                                                <exp.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                                        </div>
                                        <p className="text-gray-300 text-sm ml-14">{exp.subtitle}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
