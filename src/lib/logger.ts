/**
 * Structured logging utility
 * Environment-aware logging to reduce noise in production
 */

const isDev = import.meta.env.MODE === 'development';

export const logger = {
    /**
     * Log errors - shown in all environments
     */
    error: (message: string, ...args: unknown[]) => {
        console.error(`[ERROR] ${message}`, ...args);
        // TODO: Add error tracking service integration (e.g., Sentry)
    },

    /**
     * Log warnings - shown in all environments
     */
    warn: (message: string, ...args: unknown[]) => {
        console.warn(`[WARN] ${message}`, ...args);
    },

    /**
     * Log info - development only
     */
    info: (message: string, ...args: unknown[]) => {
        if (isDev) {
            console.log(`[INFO] ${message}`, ...args);
        }
    },

    /**
     * Log debug - development only
     */
    debug: (message: string, ...args: unknown[]) => {
        if (isDev) {
            console.log(`[DEBUG] ${message}`, ...args);
        }
    },
};

/**
 * Get user-friendly error message from unknown error
 */
export function getUserMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unexpected error occurred';
}
