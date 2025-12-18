import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { MessageSquareText, CalendarDays } from "lucide-react";

const StickyCTA = () => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 800) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end"
                >
                    {/* Desktop/Tablet: Book Demo */}
                    <Button
                        size="lg"
                        className="hidden md:flex shadow-2xl rounded-full px-8 py-6 text-lg font-bold bg-primary hover:bg-primary/90 animate-in fade-in slide-in-from-bottom-5"
                    >
                        <CalendarDays className="mr-2 h-5 w-5" />
                        {t("products.cta.bookDemo")}
                    </Button>

                    {/* Mobile: Compact CTA to avoid covering content/WhatsApp */}
                    <Button
                        size="sm"
                        className="md:hidden shadow-2xl rounded-full px-6 py-5 text-sm font-bold bg-primary hover:bg-primary/90 mr-12" // Margin right to avoid WhatsApp overlap if it's right-aligned usually
                    >
                        {t("products.cta.bookDemo")}
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StickyCTA;
