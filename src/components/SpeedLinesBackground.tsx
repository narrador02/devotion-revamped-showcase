import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const SpeedLinesBackground = () => {
    const { scrollY } = useScroll();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Parallax transforms for different layers
    const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
    const y3 = useTransform(scrollY, [0, 1000], [0, -100]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas to full screen
        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
        };
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        let animationFrame: number;
        let time = 0;

        // Animated pulse dots that travel along paths
        const pulses = [
            { progress: 0, speed: 0.003, path: 0, color: 'rgba(239, 68, 68, 0.8)' },
            { progress: 0.3, speed: 0.0025, path: 1, color: 'rgba(239, 68, 68, 0.6)' },
            { progress: 0.6, speed: 0.0035, path: 2, color: 'rgba(0, 255, 255, 0.5)' },
            { progress: 0.8, speed: 0.002, path: 3, color: 'rgba(239, 68, 68, 0.7)' },
        ];

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.005;

            const width = canvas.width;
            const height = canvas.height;

            // Define 5 main curved racing circuit paths spanning the entire page
            const paths = [
                // Path 1: Top-left to middle-right diagonal curve (covers hero + UseCases)
                {
                    start: { x: width * 0.1, y: height * 0.05 },
                    cp1: { x: width * 0.3, y: height * 0.25 },
                    cp2: { x: width * 0.5, y: height * 0.45 },
                    end: { x: width * 0.9, y: height * 0.65 },
                    color: 'rgba(239, 68, 68, 0.4)',
                    width: 3,
                    glow: 15,
                },
                // Path 2: Sweeping S-curve through all sections (hero → UseCases → Products)
                {
                    start: { x: width * 0.05, y: height * 0.15 },
                    cp1: { x: width * 0.4, y: height * 0.35 },
                    cp2: { x: width * 0.6, y: height * 0.55 },
                    end: { x: width * 0.95, y: height * 0.75 },
                    color: 'rgba(180, 30, 30, 0.35)',
                    width: 2.5,
                    glow: 12,
                },
                // Path 3: Diagonal from upper-right through middle to lower-left
                {
                    start: { x: width * 0.85, y: height * 0.1 },
                    cp1: { x: width * 0.7, y: height * 0.35 },
                    cp2: { x: width * 0.4, y: height * 0.6 },
                    end: { x: width * 0.15, y: height * 0.85 },
                    color: 'rgba(239, 68, 68, 0.3)',
                    width: 2,
                    glow: 10,
                },
                // Path 4: Middle to lower curve with cyan accent (covers UseCases → Products)
                {
                    start: { x: width * 0.2, y: height * 0.4 },
                    cp1: { x: width * 0.5, y: height * 0.5 },
                    cp2: { x: width * 0.7, y: height * 0.7 },
                    end: { x: width * 0.9, y: height * 0.9 },
                    color: 'rgba(0, 255, 255, 0.15)',
                    width: 2,
                    glow: 8,
                },
                // Path 5: Upper to middle accent line (hero → UseCases)
                {
                    start: { x: width * 0.3, y: height * 0.08 },
                    cp1: { x: width * 0.5, y: height * 0.25 },
                    cp2: { x: width * 0.65, y: height * 0.45 },
                    end: { x: width * 0.8, y: height * 0.6 },
                    color: 'rgba(239, 68, 68, 0.25)',
                    width: 1.5,
                    glow: 6,
                },
            ];

            // Draw main circuit paths with glow and animation
            paths.forEach((path, index) => {
                ctx.save();

                // Create glowing effect
                ctx.shadowBlur = path.glow;
                ctx.shadowColor = path.color;

                // Animate the stroke dash for flowing effect
                const dashOffset = (time * 50 * (1 + index * 0.2)) % 100;
                ctx.setLineDash([20, 10]);
                ctx.lineDashOffset = -dashOffset;

                // Draw the main path
                ctx.beginPath();
                ctx.strokeStyle = path.color;
                ctx.lineWidth = path.width;
                ctx.lineCap = 'round';
                ctx.moveTo(path.start.x, path.start.y);
                ctx.bezierCurveTo(
                    path.cp1.x, path.cp1.y,
                    path.cp2.x, path.cp2.y,
                    path.end.x, path.end.y
                );
                ctx.stroke();

                // Add extra glow layer
                ctx.shadowBlur = path.glow * 2;
                ctx.globalAlpha = 0.3;
                ctx.stroke();

                ctx.restore();

                // Add speed streaks along the path
                const numStreaks = 8;
                for (let i = 0; i < numStreaks; i++) {
                    const t = (i / numStreaks + time * 0.5) % 1;
                    const point = getBezierPoint(path.start, path.cp1, path.cp2, path.end, t);
                    const nextT = Math.min(t + 0.05, 1);
                    const nextPoint = getBezierPoint(path.start, path.cp1, path.cp2, path.end, nextT);

                    ctx.save();
                    ctx.beginPath();
                    ctx.strokeStyle = path.color.replace(/[\d.]+\)$/, '0.6)');
                    ctx.lineWidth = path.width * 0.6;
                    ctx.lineCap = 'round';
                    ctx.shadowBlur = path.glow * 0.8;
                    ctx.shadowColor = path.color;
                    ctx.moveTo(point.x, point.y);
                    ctx.lineTo(nextPoint.x, nextPoint.y);
                    ctx.stroke();
                    ctx.restore();
                }
            });

            // Draw animated pulse dots traveling along paths
            pulses.forEach((pulse) => {
                pulse.progress = (pulse.progress + pulse.speed) % 1;
                const path = paths[pulse.path];
                const point = getBezierPoint(path.start, path.cp1, path.cp2, path.end, pulse.progress);

                // Draw glowing pulse dot
                ctx.save();
                ctx.shadowBlur = 25;
                ctx.shadowColor = pulse.color;
                ctx.fillStyle = pulse.color;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
                ctx.fill();

                // Outer glow ring
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, []);

    // Helper function to calculate point on bezier curve
    const getBezierPoint = (
        start: { x: number; y: number },
        cp1: { x: number; y: number },
        cp2: { x: number; y: number },
        end: { x: number; y: number },
        t: number
    ) => {
        const mt = 1 - t;
        const mt2 = mt * mt;
        const mt3 = mt2 * mt;
        const t2 = t * t;
        const t3 = t2 * t;

        return {
            x: mt3 * start.x + 3 * mt2 * t * cp1.x + 3 * mt * t2 * cp2.x + t3 * end.x,
            y: mt3 * start.y + 3 * mt2 * t * cp1.y + 3 * mt * t2 * cp2.y + t3 * end.y,
        };
    };

    return (
        <>
            {/* Fixed canvas layer */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ mixBlendMode: 'screen' }}
                />
            </div>

            {/* Parallax SVG layers for added depth */}
            <motion.div
                style={{ y: y1 }}
                className="fixed inset-0 pointer-events-none z-0 opacity-40"
            >
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: 'rgb(239, 68, 68)', stopOpacity: 0.3 }} />
                            <stop offset="100%" style={{ stopColor: 'rgb(180, 30, 30)', stopOpacity: 0 }} />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 50 100 Q 300 250, 600 400 T 1200 700"
                        stroke="url(#grad1)"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.6"
                    />
                </svg>
            </motion.div>

            <motion.div
                style={{ y: y2 }}
                className="fixed inset-0 pointer-events-none z-0 opacity-30"
            >
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M 800 150 Q 500 400, 200 650 T 100 950"
                        stroke="rgba(239, 68, 68, 0.4)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                    />
                </svg>
            </motion.div>

            <motion.div
                style={{ y: y3 }}
                className="fixed inset-0 pointer-events-none z-0 opacity-20"
            >
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M 300 300 Q 600 450, 900 600 T 1100 800"
                        stroke="rgba(0, 255, 255, 0.3)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                    />
                </svg>
            </motion.div>
        </>
    );
};

export default SpeedLinesBackground;
