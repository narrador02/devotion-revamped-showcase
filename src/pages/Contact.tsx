import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
    const { t } = useTranslation();
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: t('contactPage.form.sent'),
            description: t('contactPage.form.sentDesc'),
        });
    };

    return (
        <div className="min-h-screen bg-background font-inter">
            <Helmet>
                <title>{t('contactPage.title')} {t('contactPage.subtitle')} | DevotionSim</title>
                <meta name="description" content={t('contactPage.description')} />
            </Helmet>
            <Navigation />
            <main className="pt-20">
                <div className="container mx-auto px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl md:text-6xl font-rajdhani font-bold mb-6">
                            <span className="text-foreground">{t('contactPage.title')}</span> <span className="text-primary">{t('contactPage.subtitle')}</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {t('contactPage.description')}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="space-y-8"
                        >
                            <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
                                <h3 className="text-2xl font-rajdhani font-bold mb-6 text-foreground">{t('contactPage.getInTouch')}</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Mail className="text-primary" size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{t('contactPage.form.email')}</p>
                                            <a href="mailto:info@devotionsim.com" className="text-muted-foreground hover:text-primary transition-colors">
                                                info@devotionsim.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Phone className="text-primary" size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{t('rentPurchase.form.phone')}</p>
                                            <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary transition-colors">
                                                +1 (234) 567-890
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <MapPin className="text-primary" size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{t('rentPurchase.form.city')}</p>
                                            <p className="text-muted-foreground">
                                                Madrid, Spain<br />
                                                Global Shipping Available
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="bg-card p-8 rounded-2xl border border-border shadow-lg"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">{t('contactPage.form.name')}</label>
                                        <Input placeholder="John Doe" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">{t('contactPage.form.email')}</label>
                                        <Input type="email" placeholder="john@example.com" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">{t('contactPage.form.subject')}</label>
                                    <Input placeholder="Product Inquiry" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">{t('contactPage.form.message')}</label>
                                    <Textarea placeholder="Tell us about your needs..." className="min-h-[150px]" required />
                                </div>

                                <Button type="submit" className="w-full gap-2">
                                    {t('contactPage.form.send')} <Send size={16} />
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
            <LanguageSwitcher />
        </div>
    );
};

export default Contact;
