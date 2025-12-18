import { SimulatorOption } from "@/types/simulator";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";

interface OptionsGridProps {
    options: SimulatorOption[];
}

const OptionsGrid = ({ options }: OptionsGridProps) => {
    const { t } = useTranslation();

    if (options.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                {t('products.options.noOptions')}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="font-rajdhani font-bold text-2xl mb-4">{t('products.options.title')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {options.map((option) => (
                    <div key={option.id} className="p-5 rounded-xl border border-border hover:border-primary/50 transition-colors bg-card hover:shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold font-rajdhani text-lg text-foreground">{t(option.name)}</h4>
                            <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {t(option.description)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OptionsGrid;
