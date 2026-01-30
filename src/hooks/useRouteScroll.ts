import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type ScrollMap = Record<string, string>;

/**
 * Custom hook to handle scrolling to specific elements based on the current URL path.
 * 
 * @param idMap - A mapping of URL paths (or subpaths) to DOM element IDs.
 *                Example: { '/simuladores/top-gun': 'topgun' }
 *                
 *                If the current path matches a key in the map, it scrolls to that ID.
 *                Includes a fallback to scroll to top if no match is found (standard navigation).
 */
export const useRouteScroll = (idMap: ScrollMap) => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Find if the current path matches any key in the map
        // We check for exact match or if the pathname ends with the key
        const targetId = Object.entries(idMap).find(([path]) =>
            pathname === path || pathname.endsWith(path)
        )?.[1];

        if (targetId) {
            // Check if element exists immediately
            const element = document.getElementById(targetId);

            if (element) {
                // Initial scroll
                element.scrollIntoView({ behavior: 'smooth' });

                // Retry after a small delay to handle layout shifts or image loading
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                // If element not found immediately (e.g., lazy loading), retry
                const checkInterval = setInterval(() => {
                    const el = document.getElementById(targetId);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                        clearInterval(checkInterval);
                    }
                }, 100);

                // Stop checking after 2 seconds
                setTimeout(() => clearInterval(checkInterval), 2000);
            }
        } else {
            // Standard behavior: scroll to top on route change if no specific hash/section target
            window.scrollTo(0, 0);
        }
    }, [pathname, idMap]);
};
