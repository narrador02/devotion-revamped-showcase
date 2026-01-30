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
    const navigate = useNavigate();

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
        const targetEntry = Object.entries(idMap).find(([path]) =>
            pathname === path || (path !== '/' && pathname.endsWith(path)) // Avoid '/' matching everything
        );

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
                } else if (retries < 10) {
                    // Element not found - retry (e.g. for lazy loaded content)
                    setTimeout(() => attemptScroll(retries + 1), 200);
                } else {
                    // Give up
                    isAutoScrolling.current = false;
                }
            };

            attemptScroll();
        } else {
            // Standard behavior: scroll to top if path is changing and no ID match
            // BUT only if not just changing hash/query 
            window.scrollTo(0, 0);
        }
    }, [pathname, idMap]);

    // ---------------------------------------------------------------------------
    // 2. Scroll -> URL Logic (ScrollSpy)
    // ---------------------------------------------------------------------------
    useEffect(() => {
        const ids = Object.values(idMap);

        const observerCallback: IntersectionObserverCallback = (entries) => {
            if (isAutoScrolling.current) return; // Ignore updates while auto-scrolling

            // We want to find the "most visible" element
            // or the first one that intersects significantly

            // Simple approach: check intersecting entries
            const visibleEntry = entries.find(entry => entry.isIntersecting);

            if (visibleEntry) {
                const id = visibleEntry.target.id;
                const path = reverseMap.current[id];

                // If mapped path exists and it is NOT the current path, update URL
                // We use replaceState to update URL without adding to history stack or triggering re-render/scroll
                if (path && path !== pathname && !window.location.pathname.endsWith(path)) {

                    // Update URL silently
                    // Using router navigate() might trigger re-renders or effects
                    // Using window.history.replaceState is safer for "silent" updates
                    window.history.replaceState(null, '', path);

                    // Note: This desyncs React Router's internal location state from window.location
                    // This is usually fine for cosmetic URL updates, but if we want full Router sync:
                    // navigate(path, { replace: true, state: { preventScroll: true } }); 
                    // However, that triggers the URL->Scroll effect above.
                }
            }
        };

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px', // Active when element is near top of viewport
            threshold: 0
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all target elements
        const elementsToObserve: Element[] = [];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                observer.observe(el);
                elementsToObserve.push(el);
            } else {
                // If element doesn't exist yet, we could use MutationObserver, 
                // but simpler for now implies they should be rendered by the page content
            }
        });

        // Cleanup
        return () => {
            observer.disconnect();
        };
    }, [idMap, pathname]); // Re-run if ID map changes 
};
