import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import custom1 from "@/assets/custom1.jpeg";
import custom2 from "@/assets/custom2.jpeg";
import custom3 from "@/assets/custom3.jpeg";
import custom4 from "@/assets/custom4.jpeg";
import custom5 from "@/assets/custom5.jpeg";
import custom6 from "@/assets/custom6.jpeg";
import custom7 from "@/assets/custom7.jpeg";

const images = [custom7, custom1, custom2, custom3, custom4, custom5, custom6];

const CustomizationSection = () => {
    const { t } = useTranslation();
    const [index, setIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    /* Detect mobile */
    useEffect(() => {
        const media = window.matchMedia("(max-width: 768px)");
        const update = () => setIsMobile(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);

    /* Autoplay ONLY desktop */
    useEffect(() => {
        if (isMobile) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isMobile]);

    const next = () => setIndex((prev) => (prev + 1) % images.length);
    const prev = () =>
        setIndex((prev) => (prev - 1 + images.length) % images.length);

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const halfWidth = rect.width / 2;

        if (x > halfWidth) {
            next();
        } else {
            prev();
        }
    };

    return (
        <section className="relative py-16 md:py-28 lg:py-36 overflow-hidden bg-background">
            {/* ===== BACKGROUND ===== */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-background to-black" />
                <div className="absolute -top-40 -left-40 w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-primary/15 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-primary/10 rounded-full blur-3xl" />

                {/* Diagonal racing lines - hidden on mobile for cleaner look */}
                <div className="hidden md:block absolute inset-0 opacity-[0.035]">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-[140%] h-px bg-gradient-to-r from-transparent via-white to-transparent"
                            style={{
                                top: `${8 + i * 10}%`,
                                left: "-20%",
                                transform: "rotate(-6deg)",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* ===== GIANT WORD - hidden on mobile ===== */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none select-none">
                <span className="text-[11vw] font-rajdhani font-black tracking-tight text-white/5">
                    CUSTOM LAB
                </span>
            </div>

            <div className="relative z-10 container mx-auto px-4">
                {/* ===== TITLE AND TEXT ON TOP ===== */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-10 md:mb-16"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs md:text-sm uppercase tracking-widest text-primary font-medium">
                            {t("products.customization.badge", "Personalización sin límites")}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="font-rajdhani font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-4 md:mb-6">
                        <span className="text-foreground">
                            {t("products.customization.title1", "Tu marca.")}
                        </span>{" "}
                        <span className="text-primary">
                            {t("products.customization.title2", "Tu simulador.")}
                        </span>
                    </h2>

                    {/* Subtitle */}
                    <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {t(
                            "products.customization.subtitle",
                            "No decoramos simuladores. Los convertimos en piezas visuales únicas que dominan eventos, ferias y activaciones de marca."
                        )}
                    </p>
                </motion.div>

                {/* ===== IMAGE CAROUSEL ===== */}
                <div className="relative max-w-4xl mx-auto">
                    <div
                        className="relative h-[280px] sm:h-[380px] md:h-[480px] lg:h-[540px] cursor-pointer"
                        onClick={handleImageClick}
                    >
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-primary/10 md:bg-primary/15 blur-2xl md:blur-3xl rounded-3xl scale-95" />

                        <div className="relative w-full h-full">
                            <AnimatePresence mode="popLayout">
                                {images.map((img, i) => {
                                    const position =
                                        (i - index + images.length) % images.length;

                                    if (position > 2) return null;

                                    return (
                                        <motion.img
                                            key={img}
                                            src={img}
                                            alt="Custom simulator design"
                                            drag={isMobile ? "x" : false}
                                            dragConstraints={{ left: 0, right: 0 }}
                                            dragElastic={0.1}
                                            onDragEnd={(_, info) => {
                                                if (!isMobile) return;
                                                if (info.offset.x < -50) next();
                                                if (info.offset.x > 50) prev();
                                            }}
                                            initial={{ opacity: 0, scale: 0.95, x: 40 }}
                                            animate={{
                                                opacity: position === 0 ? 1 : 0.5 - position * 0.15,
                                                scale: 1 - position * 0.04,
                                                x: position * (isMobile ? -15 : -25),
                                                rotate: position * -1,
                                            }}
                                            exit={{ opacity: 0, x: -80 }}
                                            transition={{
                                                duration: isMobile ? 0.3 : 0.5,
                                                ease: "easeOut"
                                            }}
                                            className="absolute inset-0 w-full h-full object-cover rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl border border-border bg-black select-none"
                                            style={{
                                                zIndex: 10 - position,
                                                touchAction: "pan-y",
                                                pointerEvents: position === 0 ? "auto" : "none"
                                            }}
                                        />
                                    );
                                })}
                            </AnimatePresence>

                            {/* Discreet navigation indicators */}
                            <div className="absolute inset-0 flex items-center justify-between pointer-events-none z-20 px-2 md:px-4">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-50">
                                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                </div>
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-50">
                                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                </div>
                            </div>

                            {/* Dots indicator */}
                            <div className="absolute -bottom-8 md:-bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-20">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIndex(i);
                                        }}
                                        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${i === index
                                            ? "bg-primary w-4 md:w-6"
                                            : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom divider */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </section>
    );
};

export default CustomizationSection;
