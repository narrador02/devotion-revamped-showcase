import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Trophy, Gamepad2, Megaphone, Joystick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const UseCases = () => {
    const { t } = useTranslation();

    const cases = [
        {
            icon: <Trophy size={40} />,
            title: t('useCases.professional.title'),
            description: t('useCases.professional.desc'),
            link: "/simuladores#professional",
            color: "text-yellow-500"
        },
        {
            icon: <Gamepad2 size={40} />,
            title: t('useCases.entertainment.title'),
            description: t('useCases.entertainment.desc'),
            link: "/simuladores#entertainment",
            color: "text-primary"
        },
        {
            icon: <Megaphone size={40} />,
            title: t('useCases.events.title'),
            description: t('useCases.events.desc'),
            link: "/events",
            color: "text-purple-500"
        },
        {
            icon: <Joystick size={40} />,
            title: t('useCases.leisure.title'),
            description: t('useCases.leisure.desc'),
            link: "/simuladores#leisure",
            color: "text-green-500"
        }
    ];

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-rajdhani font-bold mb-4">
                        <span className="text-foreground">{t('useCases.title')} </span>
                        <span className="text-primary">{t('useCases.highlight')}</span>
                        <span className="text-foreground"> {t('useCases.suffix')}</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t('useCases.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cases.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group relative p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full"
                        >
                            <div className={`mb-6 ${item.color} p-4 bg-background/50 rounded-full w-fit group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-rajdhani font-bold mb-3 text-foreground">{item.title}</h3>
                            <p className="text-muted-foreground mb-6 leading-relaxed text-sm flex-grow">
                                {item.description}
                            </p>
                            <Link to={item.link} className="mt-auto">
                                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                                    {t('useCases.learnMore')}
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UseCases;
