/**
 * Fetches YouTube video title and extracts name and quote
 * Expected format: "Person Name: Quote text"
 */
export async function fetchYouTubeVideoInfo(videoId: string): Promise<{
    name: string;
    quote: string;
    fullTitle: string;
}> {
    try {
        // Use YouTube oEmbed API (no API key required)
        const response = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch video info');
        }

        const data = await response.json();
        const fullTitle = data.title || '';

        // Parse title format: "Person Name: Quote text"
        const parts = fullTitle.split(':');

        if (parts.length >= 2) {
            const name = parts[0].trim();
            const quote = parts.slice(1).join(':').trim(); // Handle quotes with colons
            return { name, quote, fullTitle };
        }

        // Fallback if format doesn't match
        return {
            name: fullTitle,
            quote: 'Watch their story',
            fullTitle
        };
    } catch (error) {
        console.error('Error fetching YouTube video info:', error);
        return {
            name: 'Video',
            quote: 'Click to watch',
            fullTitle: ''
        };
    }
}

/**
 * Extract video ID from various YouTube URL formats
 */
export function extractVideoId(input: string): string {
    try {
        if (input.includes("shorts")) {
            return input.split("/shorts/")[1].split("?")[0];
        }
        if (input.includes("youtube.com") || input.includes("youtu.be")) {
            const url = new URL(input);
            return url.searchParams.get("v") || input.split("/").pop() || input;
        }
        return input;
    } catch {
        return input;
    }
}
