import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Trophy, Gamepad2, Megaphone, Joystick } from "lucide-react";

const UseCases = () => {
    const { t } = useTranslation();

    const cases = [
        {
            icon: <Trophy className="w-7 h-7 md:w-10 md:h-10" />,
            title: t('useCases.professional.title'),
            description: t('useCases.professional.desc'),
            color: "text-yellow-500"
        },
        {
            icon: <Gamepad2 className="w-7 h-7 md:w-10 md:h-10" />,
            title: t('useCases.entertainment.title'),
            description: t('useCases.entertainment.desc'),
            color: "text-primary"
        },
        {
            icon: <Megaphone className="w-7 h-7 md:w-10 md:h-10" />,
            title: t('useCases.events.title'),
            description: t('useCases.events.desc'),
            color: "text-purple-500"
        },
        {
            icon: <Joystick className="w-7 h-7 md:w-10 md:h-10" />,
            title: t('useCases.leisure.title'),
            description: t('useCases.leisure.desc'),
            color: "text-green-500"
        }
    ];

    return (
        <section className="py-1 md:py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-[1.8rem] sm:text-3xl md:text-5xl font-rajdhani font-bold mb-4">
                        <span className="text-foreground">{t('useCases.title')} </span>
                        <span className="text-primary">{t('useCases.highlight')}</span>
                        <span className="text-foreground"> {t('useCases.suffix')}</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                        {t('useCases.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cases.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className="group p-5 md:p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 flex flex-col md:min-h-[320px]"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`${item.color} p-3 bg-background/50 rounded-full w-fit shrink-0`}>
                                    {item.icon}
                                </div>

                                <h3 className="text-lg md:text-xl font-rajdhani font-bold text-foreground">
                                    {item.title}
                                </h3>
                            </div>

                            {/* Description */}
                            <p className="text-muted-foreground text-base md:text-lg leading-relaxed flex-grow">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UseCases;
