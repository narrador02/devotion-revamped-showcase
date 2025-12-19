/// <reference types="vite/client" />

// Video file type declarations
declare module '*.mp4' {
    const src: string;
    export default src;
}
