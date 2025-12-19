import React, { useRef, useState, useEffect, useCallback } from "react";
import { useVideoContext } from "@/contexts/VideoContext";

interface ProductVideoProps {
    id: string;
    videoSrc: string;
    posterSrc: string;
    alt: string;
    className?: string;
    loop?: boolean;
    maxPlays?: number;
    preloadMode?: "none" | "metadata";
}

// Check if we're on a mobile device (touch-primary)
const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
};

const ProductVideo: React.FC<ProductVideoProps> = ({
    id,
    videoSrc,
    posterSrc,
    alt,
    className = "",
    loop = false,
    maxPlays = 1,
    preloadMode = "none",
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPoster, setShowPoster] = useState(true);
    const [playCount, setPlayCount] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const { activeVideoId, setActiveVideo } = useVideoContext();

    // Check if this video should be active
    const isActive = activeVideoId === id;

    // Detect mobile on mount
    useEffect(() => {
        setIsMobile(isMobileDevice());

        const handleResize = () => {
            setIsMobile(isMobileDevice());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Reset video to poster state
    const resetVideo = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        setIsPlaying(false);
        setShowPoster(true);
        setPlayCount(0);
    }, []);

    // Handle when another video becomes active
    useEffect(() => {
        if (!isActive && isPlaying) {
            resetVideo();
        }
    }, [isActive, isPlaying, resetVideo]);

    // Start playing video
    const startPlaying = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        // Claim active status
        setActiveVideo(id);
        setShowPoster(false);
        setPlayCount(0);

        video.currentTime = 0;
        video.play().then(() => {
            setIsPlaying(true);
        }).catch((error) => {
            console.warn("Video play failed:", error);
            // Fallback: show poster
            setShowPoster(true);
        });
    }, [id, setActiveVideo]);

    // Stop and reset video
    const stopPlaying = useCallback(() => {
        if (activeVideoId === id) {
            setActiveVideo(null);
        }
        resetVideo();
    }, [id, activeVideoId, setActiveVideo, resetVideo]);

    // Handle video ended event (for non-loop videos)
    const handleVideoEnded = useCallback(() => {
        if (loop) {
            // Seamless loop - this shouldn't fire but just in case
            return;
        }

        const newPlayCount = playCount + 1;
        setPlayCount(newPlayCount);

        if (newPlayCount >= maxPlays) {
            // Freeze on last frame - video naturally pauses at end
            setIsPlaying(false);
            // Keep showPoster false to show frozen last frame
        } else {
            // Play again
            const video = videoRef.current;
            if (video) {
                video.currentTime = 0;
                video.play().catch(console.warn);
            }
        }
    }, [loop, playCount, maxPlays]);

    // Desktop hover handlers (only on non-mobile)
    const handleMouseEnter = useCallback(() => {
        if (!isMobile) {
            startPlaying();
        }
    }, [isMobile, startPlaying]);

    const handleMouseLeave = useCallback(() => {
        if (!isMobile) {
            stopPlaying();
        }
    }, [isMobile, stopPlaying]);

    // Mobile: Intersection Observer for viewport autoplay
    useEffect(() => {
        if (!isMobile || !containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Element is in viewport - start playing
                        startPlaying();
                    } else {
                        // Element left viewport - stop and reset
                        stopPlaying();
                    }
                });
            },
            {
                threshold: 0.5, // 50% of the element must be visible
                rootMargin: '0px',
            }
        );

        observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
        };
    }, [isMobile, startPlaying, stopPlaying]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden bg-background ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Poster Image - always rendered for SEO, visibility controlled */}
            <img
                src={posterSrc}
                alt={alt}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${showPoster ? "opacity-100" : "opacity-0"
                    }`}
            />

            {/* Video Element */}
            <video
                ref={videoRef}
                src={videoSrc}
                muted
                playsInline
                preload={preloadMode}
                loop={loop}
                onEnded={handleVideoEnded}
                className={`w-full h-full object-cover object-center transition-opacity duration-300 ${showPoster ? "opacity-0" : "opacity-100"
                    }`}
                aria-hidden="true"
            />
        </div>
    );
};

export default ProductVideo;

