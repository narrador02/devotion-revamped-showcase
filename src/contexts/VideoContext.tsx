import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface VideoContextType {
    activeVideoId: string | null;
    setActiveVideo: (id: string | null) => void;
    clearActiveVideo: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

interface VideoProviderProps {
    children: ReactNode;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

    const setActiveVideo = useCallback((id: string | null) => {
        setActiveVideoId(id);
    }, []);

    const clearActiveVideo = useCallback(() => {
        setActiveVideoId(null);
    }, []);

    return (
        <VideoContext.Provider value={{ activeVideoId, setActiveVideo, clearActiveVideo }}>
            {children}
        </VideoContext.Provider>
    );
};

export const useVideoContext = (): VideoContextType => {
    const context = useContext(VideoContext);
    if (context === undefined) {
        throw new Error("useVideoContext must be used within a VideoProvider");
    }
    return context;
};

export default VideoContext;
