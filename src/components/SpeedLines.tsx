import { useEffect, useRef } from 'react';

interface SpeedLinesProps {
    color?: string;
    density?: number;
    speed?: number;
    opacity?: number;
    className?: string;
}

const SpeedLines = ({
    color = '#00ffff',
    density = 20,
    speed = 1,
    opacity = 0.3,
    className = ''
}: SpeedLinesProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let lines: { x: number; y: number; length: number; speed: number; width: number }[] = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initLines();
        };

        const initLines = () => {
            lines = [];
            for (let i = 0; i < density; i++) {
                lines.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    length: Math.random() * 200 + 50,
                    speed: (Math.random() * 10 + 5) * speed,
                    width: Math.random() * 2 + 0.5
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Convert hex/hsl color to rgba for opacity control if needed, 
            // but here we assume 'color' is a valid CSS color string.
            // We'll use globalAlpha for opacity.
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = color;
            ctx.lineCap = 'round';

            lines.forEach(line => {
                ctx.beginPath();
                ctx.lineWidth = line.width;
                ctx.moveTo(line.x, line.y);
                ctx.lineTo(line.x - line.length, line.y - line.length * 0.5); // Angled lines
                ctx.stroke();

                // Update position
                line.x += line.speed;
                line.y += line.speed * 0.5;

                // Reset if out of bounds
                if (line.x > canvas.width + line.length || line.y > canvas.height + line.length) {
                    line.x = -line.length;
                    line.y = Math.random() * canvas.height;
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [color, density, speed, opacity]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 pointer-events-none ${className}`}
        />
    );
};

export default SpeedLines;
