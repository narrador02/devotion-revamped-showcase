import { SimulatorModel, SharedSpec } from "@/types/simulator";
import { useTranslation } from "react-i18next";

interface SpecsListProps {
    model: SimulatorModel;
    sharedSpecs: SharedSpec[];
}

const SpecsList = ({ model, sharedSpecs }: SpecsListProps) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <h3 className="font-rajdhani font-bold text-2xl mb-4">{t('products.specs.modelTitle')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Model Specific Specs */}
                {model.specs.map((spec, idx) => (
                    <div key={`spec-${idx}`} className="p-4 rounded-xl bg-muted/50 border border-border/50">
                        <div className="text-sm text-muted-foreground mb-1">{t(spec.label)}</div>
                        <div className="font-bold text-base md:text-lg">{t(spec.value)}</div>
                    </div>
                ))}
            </div>

            <h3 className="font-rajdhani font-bold text-2xl mb-4 pt-4">{t('products.specs.sharedTitle')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Shared Specs */}
                {sharedSpecs.map((spec, idx) => (
                    <div key={`shared-${idx}`} className="p-4 rounded-xl bg-muted/50 border border-border/50">
                        <div className="text-sm text-muted-foreground mb-1">{t(spec.key)}</div>
                        <div className="font-bold text-base md:text-lg">{t(spec.value)}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                    <div className="text-sm text-muted-foreground mb-1">{t('products.movementSystem')}</div>
                    <div className="font-bold text-base md:text-lg">{model.badge}</div>
                </div>

                <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                    <div className="text-sm text-muted-foreground mb-1">{t('products.bestFor')}</div>
                    <div className="font-bold text-base md:text-lg">{t(model.usage)}</div>
                </div>
            </div>
        </div>
    );
};

export default SpecsList;
