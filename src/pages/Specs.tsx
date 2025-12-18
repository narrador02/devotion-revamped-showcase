import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useTranslation } from "react-i18next";
import { simulatorsData } from "@/data/simulators";
import ComparisonTable from "@/components/simulators/ComparisonTable";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import SpecsList from "@/components/simulators/SpecsList";

const Specs = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-background font-inter flex flex-col">
            <SEO
                title={t('products.specsPage.title') + " | DevotionSim"}
                description={t('products.specsPage.subtitle')}
                path="/specs"
            />
            <Navigation />

            <main className="flex-grow pt-32 pb-20 container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <Button asChild variant="ghost" className="mb-6">
                        <Link to="/simuladores">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Simulators
                        </Link>
                    </Button>
                    <h1 className="text-4xl md:text-5xl font-rajdhani font-bold mb-4">{t('products.specsPage.title')}</h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        {t('products.specsPage.subtitle')}
                    </p>
                    <Button size="lg" className="rounded-full px-8">
                        {t('products.cta.bookDemo')}
                    </Button>
                </div>

                {/* Comparison Block */}
                <section className="mb-20">
                    <h2 className="text-2xl font-rajdhani font-bold mb-8 text-center">{t('products.comparison.title')}</h2>
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <ComparisonTable className="w-full" />
                    </div>
                </section>

                {/* Full Specs List - Grouped by Model */}
                <section className="space-y-16">
                    {simulatorsData.models.map(model => (
                        <div key={model.id} id={model.id} className="scroll-mt-32">
                            <div className="flex items-center gap-4 mb-6 border-b border-border pb-4">
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${model.gradientClass} border ${model.borderClass} flex items-center justify-center`}>
                                    <span className="text-xs font-bold text-white">{model.badge.split('-')[0]}</span>
                                </div>
                                <h2 className="text-3xl font-rajdhani font-bold">{t(model.title)}</h2>
                            </div>

                            <SpecsList model={model} sharedSpecs={simulatorsData.sharedSpecs} />

                            {/* Add Options for this model if relevant? Or generic options below. */}
                        </div>
                    ))}
                </section>

                {/* Options List */}
                <section className="mt-20 pt-12 border-t border-border">
                    <h2 className="text-3xl font-rajdhani font-bold mb-8">{t('products.options.title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {simulatorsData.options.map(option => (
                            <div key={option.id} className="bg-muted/30 p-6 rounded-xl border border-border">
                                <div className="flex items-center gap-3 mb-3">
                                    <CheckCircle2 className="text-primary h-5 w-5" />
                                    <h3 className="font-bold text-lg">{t(option.name)}</h3>
                                </div>
                                <p className="text-muted-foreground">{t(option.description)}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {option.bestForTags.map(tag => (
                                        <span key={tag} className="text-xs px-2 py-1 rounded-full bg-background border border-border text-muted-foreground">
                                            {t(tag)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
};

export default Specs;
