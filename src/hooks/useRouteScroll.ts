import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type ScrollMap = Record<string, string>;

/**
 * Bi-directional scrolling hook.
 * 1. URL -> Scroll: When URL matches a key in idMap, scroll to the corresponding ID.
 * 2. Scroll -> URL: When user scrolls and a section matching an ID becomes active, update URL.
 * 
 * @param idMap - Map of '/path' -> 'elementId'
 */
export const useRouteScroll = (idMap: ScrollMap) => {
    const { pathname } = useLocation();

    // Track if we are currently scrolling automatically to avoid triggering URL updates
    const isAutoScrolling = useRef(false);

    // Reverse map for Scroll -> URL (ID -> Path)
    const reverseMap = useRef<Record<string, string>>({});

    useEffect(() => {
        // Build reverse map once
        const rev: Record<string, string> = {};
        Object.entries(idMap).forEach(([path, id]) => {
            rev[id] = path;
        });
        reverseMap.current = rev;
    }, [idMap]);

    // ---------------------------------------------------------------------------
    // 1. URL -> Scroll Logic (Initial Load & Navigation)
    // ---------------------------------------------------------------------------
    useEffect(() => {
        // Find if current path has a mapping
        // Logic: specific path match or endsWith (for flexibility)
        // We prioritize exact match first
        let targetEntry = Object.entries(idMap).find(([path]) => pathname === path);

        // If no exact match, try matching suffix (unless it's root '/')
        if (!targetEntry) {
            targetEntry = Object.entries(idMap).find(([path]) =>
                path !== '/' && pathname.endsWith(path)
            );
        }

        const targetId = targetEntry ? targetEntry[1] : null;

        if (targetId) {
            isAutoScrolling.current = true;

            const attemptScroll = (retries = 0) => {
                const element = document.getElementById(targetId);

                if (element) {
                    // Slight delay to ensure layout is stable
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Re-enable scroll observation after animation finishes (approx 1s)
                        setTimeout(() => {
                            isAutoScrolling.current = false;
                        }, 1000);
                    }, 100);
                } else if (retries < 15) {
                    // Element not found - retry.
                    // Retry more frequently at first, then back off? No, just linear for now.
                    // 15 * 200 = 3000ms = 3 seconds
                    setTimeout(() => attemptScroll(retries + 1), 200);
                } else {
                    // Give up
                    isAutoScrolling.current = false;
                }
            };

            attemptScroll();
        } else {
            // Standard behavior: scroll to top if path is changing and no ID match.
            // BUT: We check if the NEW path maps to ANY ID. If not, and it's a new page load, scroll top.
            // If we are just changing hashes in the same page, we might not want this?
            // Actually, if 'targetId' is null, it means we navigated to a route that HAS NO SECTION MAPPING.
            // In that case, standard ScrollToTop is desired.

            // Only scroll to top if we aren't already at the top (optimization)
            if (window.scrollY > 0) {
                window.scrollTo(0, 0);
            }
        }
    }, [pathname, idMap]);

    // ---------------------------------------------------------------------------
    // 2. Scroll -> URL Logic (ScrollSpy)
    // ---------------------------------------------------------------------------
    useEffect(() => {
        // Observer callback
        const observerCallback: IntersectionObserverCallback = (entries) => {
            if (isAutoScrolling.current) return;

            // Find the element that is most visible in the viewport
            // We use a specific rootMargin to detection the "active" section
            const visibleEntry = entries.find(entry => entry.isIntersecting);

            if (visibleEntry) {
                const id = visibleEntry.target.id;
                const path = reverseMap.current[id];

                // Only update if path exists, is different
                if (path && path !== window.location.pathname) {
                    // Check endsWith to avoid partial matches on base path if not desired,
                    // but usually 'equal' or 'endsWith' check is fine.
                    // The requirement: "URL updates". 
                    // Use replaceState to be silent.
                    try {
                        window.history.replaceState(null, '', path);
                    } catch (e) {
                        // ignore security errors
                    }
                }
            }
        };

        const observerOptions = {
            root: null,
            // Adjust rootMargin to trigger when element is in the middle of the screen
            // '-40% 0px -40% 0px' means the intersection area is a thin strip in the middle 20% vertical
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Retry logic to attach observers to elements that might render late
        let retryCount = 0;
        const maxRetries = 20; // Try for ~10 seconds (500ms * 20)

        const attachObservers = () => {
            const ids = Object.values(idMap);
            let foundAll = true;
            let foundAny = false;

            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    observer.observe(el);
                    foundAny = true;
                } else {
                    foundAll = false;
                }
            });

            // If we haven't found all expected elements, keep trying
            if (!foundAll && retryCount < maxRetries) {
                retryCount++;
                setTimeout(attachObservers, 500);
            }
        };

        // Start trying to attach
        attachObservers();

        return () => {
            observer.disconnect();
        };
    }, [idMap]); // Removed 'pathname' dependency to prevent re-attaching/loops
};
