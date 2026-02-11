/**
 * Fetch wrapper with timeout and abort controller support
 * Prevents requests from hanging indefinitely and allows proper cleanup
 */
export async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = 10000
): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timer);
        return response;
    } catch (error) {
        clearTimeout(timer);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
    }
}

/**
 * Safe JSON parsing with error handling
 */
export async function parseJSON<T>(response: Response): Promise<T> {
    try {
        return await response.json();
    } catch (error) {
        throw new Error('Invalid JSON response');
    }
}
