import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface CountUpMetricProps {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    label: string;
    decimals?: number;
}

const CountUpMetric = ({
    end,
    duration = 2,
    prefix = "",
    suffix = "",
    label,
    decimals = 0
}: CountUpMetricProps) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number | null = null;
        const startValue = 0;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

            // Easing function for smooth acceleration/deceleration
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            setCount(startValue + (end - startValue) * easeOutQuart);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, end, duration]);

    const formatNumber = (num: number) => {
        return num.toLocaleString('es-ES', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
        >
            <div className="text-4xl md:text-5xl font-bold font-rajdhani text-white mb-2">
                {prefix}{formatNumber(count)}{suffix}
            </div>
            <div className="text-sm md:text-base text-gray-400 uppercase tracking-wider">
                {label}
            </div>
        </motion.div>
    );
};

export default CountUpMetric;
