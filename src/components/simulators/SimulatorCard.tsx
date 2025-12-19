import { SimulatorModel } from "@/types/simulator";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, Check, Zap, Gauge, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductVideo from "@/components/ProductVideo";

interface SimulatorCardProps {
    model: SimulatorModel;
    index: number;
    onLearnMore: (model: SimulatorModel) => void;
}

const iconMap = {
    Zap: Zap,
    Gauge: Gauge,
    Rocket: Rocket
};

const SimulatorCard = ({ model, index, onLearnMore }: SimulatorCardProps) => {
    const { t } = useTranslation();
    const Icon = iconMap[model.iconName as keyof typeof iconMap] || Zap;
    const isReversed = index % 2 !== 0;

    // Safe image handling
    const imgSrc = typeof model.image === 'string' ? model.image : model.image.src;
    const posterSrc = model.poster ? (typeof model.poster === 'string' ? model.poster : model.poster) : imgSrc;

    return (
        <motion.div
            id={model.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
        >
            {/* Image/Video Side */}
            <div className="w-full lg:w-1/2">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="relative group"
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${model.gradientClass} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
                    <div className={`relative overflow-hidden rounded-3xl border-2 ${model.borderClass} shadow-2xl aspect-square`}>
                        <ProductVideo
                            id={`simulator-${model.id}`}
                            videoSrc={model.video!}
                            posterSrc={posterSrc}
                            alt={t(model.title)}
                            className="w-full h-full"
                            loop={model.videoLoop}
                            maxPlays={model.videoMaxPlays}
                            preloadMode={model.videoPreload}
                        />
                        <div className={`absolute top-6 right-6 px-4 py-2 rounded-full bg-gradient-to-r ${model.gradientClass} border ${model.borderClass} backdrop-blur-sm z-10`}>
                            <span className="font-bold text-sm">{model.badge}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-1/2 space-y-6">
                <div className="flex items-center gap-4 mb-3">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${model.gradientClass} border ${model.borderClass} shrink-0`}>
                        <Icon className="text-white" size={24} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-rajdhani font-bold m-0">{t(model.title)}</h2>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground mb-4">{t('products.bestFor')}: {t(model.usage)}</p>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        {t(model.shortDescription)}
                    </p>
                    <p className="text-base text-muted-foreground leading-relaxed">
                        {t(model.fullDescription)}
                    </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                    <h3 className="font-rajdhani font-bold text-xl mb-4">{t('products.keyFeatures')}</h3>
                    {model.features.map((featureKey, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-3"
                        >
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${model.gradientClass} border ${model.borderClass} flex items-center justify-center shrink-0`}>
                                <Check size={14} className="text-foreground" />
                            </div>
                            <span className="text-foreground">{t(featureKey)}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 pt-6">
                    {model.specs.slice(0, 2).map((spec, idx) => (
                        <div key={idx} className={`p-4 rounded-xl bg-gradient-to-br ${model.gradientClass} border ${model.borderClass}`}>
                            <div className="text-sm text-muted-foreground mb-1">{t(spec.label)}</div>
                            <div className="font-bold text-sm">{t(spec.value)}</div>
                        </div>
                    ))}
                </div>

                <Button
                    size="lg"
                    onClick={() => onLearnMore(model)}
                    className={`w-full md:w-auto text-white px-8 py-6 rounded-full shadow-lg transition-all hover:scale-105 ${model.buttonClass}`}
                >
                    {t('products.learnMore')}
                    <ArrowRight className="ml-2" />
                </Button>
            </div>
        </motion.div>
    );
};

export default SimulatorCard;
