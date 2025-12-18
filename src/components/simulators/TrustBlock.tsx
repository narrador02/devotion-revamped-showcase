import { useTranslation } from "react-i18next";
import { PartyPopper, GraduationCap, Trophy } from "lucide-react";

const TrustBlock = () => {
    const { t } = useTranslation();

    const items = [
        { icon: PartyPopper, label: "products.trust.events", color: "text-blue-500", bg: "bg-blue-500/10" },
        { icon: GraduationCap, label: "products.trust.schools", color: "text-purple-500", bg: "bg-purple-500/10" },
        { icon: Trophy, label: "products.trust.pro", color: "text-amber-500", bg: "bg-amber-500/10" },
    ];

    return (
        <section className="py-12 border-t border-border/50 bg-muted/20">
            <div className="container mx-auto px-4">
                <h3 className="text-center font-rajdhani font-bold text-lg text-muted-foreground uppercase tracking-widest mb-8">
                    {t("products.trust.title")}
                </h3>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-3">
                            <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center`}>
                                <item.icon className={`${item.color}`} size={24} />
                            </div>
                            <span className="text-sm font-medium text-center max-w-[150px] leading-tight">
                                {t(item.label)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustBlock;
