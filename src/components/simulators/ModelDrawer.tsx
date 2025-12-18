import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimulatorModel, SharedSpec, SimulatorOption } from "@/types/simulator";
import SpecsList from "./SpecsList";
import OptionsGrid from "./OptionsGrid";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ModelDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    model: SimulatorModel | null;
    sharedSpecs: SharedSpec[];
    options: SimulatorOption[];
    onCompare: () => void;
}

const ModelDrawer = ({ isOpen, onClose, model, sharedSpecs, options, onCompare }: ModelDrawerProps) => {
    const { t } = useTranslation();

    if (!model) return null;

    // Safe image handling
    const imgSrc = typeof model.image === 'string' ? model.image : model.image.src;

    return (
        <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <SheetContent className="w-[90vw] md:w-[600px] lg:w-[800px] p-0 flex flex-col bg-background/95 backdrop-blur-xl border-l border-border">
                {/* Header */}
                <SheetHeader className="p-6 pb-2 border-b border-border/50">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <SheetTitle className="text-3xl font-rajdhani font-bold flex items-center gap-3">
                                <span className={model.textClass}>{model.badge}</span>
                                {t(model.title)}
                            </SheetTitle>
                            <SheetDescription className="text-base text-muted-foreground mt-1">
                                {t(model.shortDescription)}
                            </SheetDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={onCompare} className="hidden sm:flex gap-2">
                            <BarChart2 className="h-4 w-4" />
                            {t('products.comparison.title')}
                        </Button>
                    </div>
                </SheetHeader>

                {/* Content Area - Scrollable */}
                <ScrollArea className="flex-grow">
                    <div className="p-6">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 rounded-lg p-1">
                                <TabsTrigger value="overview" className="rounded-md">{t('products.tabs.overview')}</TabsTrigger>
                                <TabsTrigger value="specs" className="rounded-md">{t('products.tabs.specs')}</TabsTrigger>
                                <TabsTrigger value="options" className="rounded-md">{t('products.tabs.options')}</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
                                <div className="relative aspect-video rounded-xl overflow-hidden border border-border shadow-md mb-6">
                                    <img src={imgSrc} alt={t(model.title)} className="w-full h-full object-cover" />
                                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${model.gradientClass} border ${model.borderClass} backdrop-blur-sm`}>
                                        <span className="font-bold text-xs text-white">{model.badge}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-rajdhani font-bold text-xl mb-3">Professional Grade Simulation</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {t(model.fullDescription)}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                        <div className="font-bold text-primary mb-1">{t('products.bestFor')}</div>
                                        <div className="text-sm">{t(model.usage)}</div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                        <div className="font-bold text-primary mb-1">{t('products.movementSystem')}</div>
                                        <div className="text-sm">{t(model.axes)}</div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="specs" className="focus-visible:outline-none space-y-8">
                                <SpecsList model={model} sharedSpecs={sharedSpecs} />

                                <div className="flex justify-center pt-4">
                                    <Button asChild variant="link" className="text-primary text-lg">
                                        <Link to="/specs">
                                            {t('products.specsPage.viewFullSpecs')}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="options" className="focus-visible:outline-none">
                                <OptionsGrid options={options} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default ModelDrawer;
