import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Headset, Play, Sparkles } from "lucide-react";

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
                        <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">Next Gen Immersion</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        Virtual Reality <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                            Like Never Before
                        </span>
                    </h2>

                    <p className="text-gray-400 text-lg leading-relaxed">
                        Step inside the helmet of a professional rider. Our VR integration provides
                        unmatched depth perception and speed sensation, creating an adrenaline
                        rush that flat screens simply cannot match.
                    </p>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-white font-medium">
                                <Sparkles className="w-4 h-4 text-red-500" />
                                4K Resolution
                            </div>
                            <p className="text-sm text-gray-500">Crystal clear optics for maximum realism</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-white font-medium">
                                <Play className="w-4 h-4 text-red-500" />
                                120Hz Refresh Rate
                            </div>
                            <p className="text-sm text-gray-500">Butter smooth motion without motion sickness</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent blur-3xl -z-10" />
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-2xl">
                        {/* Placeholder for VR image - using a stylized abstract representation since checking for specific image assets is out of scope for this quick iteration */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Headset className="w-32 h-32 text-gray-800" />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black to-transparent">
                            <p className="text-white font-medium">Meta Quest 3 / HP Reverb G2</p>
                            <p className="text-red-400 text-sm">Enterprise Edition</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
