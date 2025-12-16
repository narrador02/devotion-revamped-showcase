import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import SEO from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, Globe, Settings, FileText, Headphones, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const Contact = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: t('contactPage.form.sent'),
            description: t('contactPage.form.sentDesc'),
        });
    };

    const toggleFaq = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-background font-inter">
            <SEO
                title={t('seo.contact.title')}
                description={t('seo.contact.description')}
                keywords={t('seo.contact.keywords')}
                path="/contact"
            />
            <Helmet>
                <title>{t('contactPage.title')} {t('contactPage.subtitle')} | DevotionSim</title>
                <meta name="description" content={t('contactPage.description')} />
            </Helmet>
            <Navigation />
            <main className="pt-20">
                {/* Hero Section with Enhanced Background */}
                <div className="relative overflow-hidden bg-gradient-to-br from-black via-black to-primary/10">
                    {/* Speed Lines Background */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent transform -skew-y-12"></div>
                        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent transform skew-y-6"></div>
                        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent transform -skew-y-3"></div>
                    </div>

                    {/* Circular Glow Behind Title */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>

                    <div className="container mx-auto px-4 py-16 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-5xl md:text-6xl font-rajdhani font-bold mb-6">
                                <span className="text-foreground">{t('contactPage.title')}</span> <span className="text-primary">{t('contactPage.subtitle')}</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                {t('contactPage.heroSubtitle')}
                            </p>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16"
                        >
                            {[
                                { icon: Clock, text: t('contactPage.trustBadges.response') },
                                { icon: CheckCircle, text: t('contactPage.trustBadges.quote') },
                                { icon: Globe, text: t('contactPage.trustBadges.international') }
                            ].map((badge, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -4, boxShadow: "0 0 20px rgba(239, 68, 68, 0.3)" }}
                                    className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-4 transition-all"
                                >
                                    <badge.icon className="text-primary" size={20} />
                                    <span className="text-sm font-medium text-foreground">{badge.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Main Two-Column Layout */}
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
                        {/* Left Card - Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-5"
                        >
                            <div className="bg-card p-8 rounded-2xl border-2 border-primary/30 shadow-[0_0_20px_rgba(239,68,68,0.15)] h-full">
                                <h3 className="text-2xl font-rajdhani font-bold mb-6 text-foreground">{t('contactPage.getInTouch')}</h3>
                                <div className="space-y-6">
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Mail className="text-primary transition-transform hover:scale-110" size={22} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{t('contactPage.form.email')}</p>
                                            <a href="mailto:info@devotionsim.com" className="text-muted-foreground hover:text-primary transition-colors">
                                                info@devotionsim.com
                                            </a>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Phone className="text-primary transition-transform hover:scale-110" size={22} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{t('rentPurchase.form.phone')}</p>
                                            <a href="tel:+34696268312" className="text-muted-foreground hover:text-primary transition-colors">
                                                +34 696 26 83 12
                                            </a>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <MapPin className="text-primary transition-transform hover:scale-110" size={22} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{t('rentPurchase.form.city')}</p>
                                            <p className="text-muted-foreground">
                                                Barcelona, Spain<br />
                                                {t('contactPage.globalShipping')}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>

                                <p className="mt-8 text-sm text-muted-foreground border-t border-border pt-6">
                                    {t('contactPage.whatsappMessage')}
                                </p>
                            </div>
                        </motion.div>

                        {/* Right Card - Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="lg:col-span-7"
                        >
                            <div className="bg-card p-8 rounded-2xl border-2 border-primary/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">{t('contactPage.form.name')}</label>
                                            <Input
                                                placeholder={t('contactPage.form.namePlaceholder')}
                                                required
                                                className="py-4 px-5 focus:border-primary focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">{t('contactPage.form.email')}</label>
                                            <Input
                                                type="email"
                                                placeholder={t('contactPage.form.emailPlaceholder')}
                                                required
                                                className="py-4 px-5 focus:border-primary focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">{t('contactPage.form.subject')}</label>
                                        <Input
                                            placeholder={t('contactPage.form.subjectPlaceholder')}
                                            required
                                            className="py-4 px-5 focus:border-primary focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">{t('contactPage.form.message')}</label>
                                        <Textarea
                                            placeholder={t('contactPage.form.messagePlaceholder')}
                                            className="min-h-[150px] py-4 px-5 focus:border-primary focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                type="submit"
                                                className="w-full gap-2 py-6 bg-gradient-to-r from-primary to-red-600 hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all"
                                            >
                                                <Send size={18} />
                                                {t('contactPage.form.send')}
                                            </Button>
                                        </motion.div>
                                        <p className="text-xs text-center text-muted-foreground">
                                            {t('contactPage.privacyMessage')}
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>

                    {/* What to Expect Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mt-20 max-w-5xl mx-auto"
                    >
                        <h2 className="text-3xl font-rajdhani font-bold text-center mb-12 text-foreground">
                            {t('contactPage.whatToExpect.title')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { icon: Settings, text: t('contactPage.whatToExpect.point1') },
                                { icon: CheckCircle, text: t('contactPage.whatToExpect.point2') },
                                { icon: FileText, text: t('contactPage.whatToExpect.point3') },
                                { icon: Headphones, text: t('contactPage.whatToExpect.point4') }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-4 p-4"
                                >
                                    <item.icon className="text-primary shrink-0 mt-1" size={24} />
                                    <p className="text-muted-foreground">{item.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Social Proof Strip */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mt-20 text-center"
                    >
                        <h3 className="text-2xl font-rajdhani font-bold mb-8 text-foreground">
                            {t('contactPage.socialProof.title')}
                        </h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {(t('contactPage.socialProof.clients', { returnObjects: true }) as string[]).map((client, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05, borderColor: "rgba(239, 68, 68, 0.5)" }}
                                    className="px-6 py-3 bg-card/50 border border-border rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-all cursor-default"
                                >
                                    {client}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* FAQ Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mt-20 max-w-4xl mx-auto mb-16"
                    >
                        <h3 className="text-3xl font-rajdhani font-bold text-center mb-12 text-foreground">
                            {t('contactPage.faq.title')}
                        </h3>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((num) => (
                                <motion.div
                                    key={num}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
                                >
                                    <button
                                        onClick={() => toggleFaq(num)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-card/80 transition-colors"
                                    >
                                        <span className="font-medium text-foreground pr-4">
                                            {t(`contactPage.faq.q${num}`)}
                                        </span>
                                        <motion.div
                                            animate={{ rotate: expandedFaq === num ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {expandedFaq === num ? (
                                                <ChevronUp className="text-primary shrink-0" size={20} />
                                            ) : (
                                                <ChevronDown className="text-primary shrink-0" size={20} />
                                            )}
                                        </motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {expandedFaq === num && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-6 text-muted-foreground border-t border-border pt-4">
                                                    {t(`contactPage.faq.a${num}`)}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
            <LanguageSwitcher />
        </div>
    );
};

export default Contact;
