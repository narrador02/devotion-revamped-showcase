
import { simulatorsData } from "@/data/simulators";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";

interface ComparisonTableProps {
    className?: string;
}

const ComparisonTable = ({ className }: ComparisonTableProps) => {
    const { t } = useTranslation();

    const features = [
        { key: "axes", label: "products.comparison.axes" },
        { key: "maxLean", label: "products.comparison.maxLean" },
        { key: "wheelie", label: "products.comparison.wheelie" },
        { key: "rearSlide", label: "products.comparison.rearSlide" },
        { key: "surge", label: "products.comparison.surge" },
        { key: "usage", label: "products.bestFor" },
    ];

    const getFeatureValue = (model: any, featureKey: string) => {
        const val = model[featureKey];
        if (val === "products.comparison.yes") return <Check className="text-green-500 mx-auto" size={20} />;
        if (val === "products.comparison.no") return <X className="text-muted-foreground/30 mx-auto" size={20} />;
        return <span className="text-sm font-medium">{t(val)}</span>;
    };

    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full border-collapse min-w-[600px]">
                <thead>
                    <tr>
                        <th className="p-4 text-left w-1/4"></th>
                        {simulatorsData.models.map((model) => (
                            <th key={model.id} className="p-4 text-center w-1/4">
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${model.gradientClass} border ${model.borderClass} flex items-center justify-center`}>
                                        <span className="text-xs font-bold text-white">{model.badge.split('-')[0]}</span>
                                    </div>
                                    <span className="font-rajdhani font-bold">{t(model.title)}</span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {features.map((feature, idx) => (
                        <tr key={feature.key} className={`border-t border-border/50 ${idx % 2 === 0 ? 'bg-muted/10' : ''}`}>
                            <td className="p-4 font-medium text-sm text-muted-foreground">
                                {t(feature.label)}
                            </td>
                            {simulatorsData.models.map((model) => (
                                <td key={model.id} className="p-4 text-center">
                                    {getFeatureValue(model, feature.key)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ComparisonTable;
