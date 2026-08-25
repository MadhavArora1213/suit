import { useEffect, useRef } from 'react';
import { trackPageView, trackTimeOnPage, trackScrollDepth, trackScrollMilestone, trackBackNavigation, trackSessionEnd } from '../utils/analytics';

/**
 * Full page tracking: view, scroll milestones (25/50/75/100%), time on page, back-nav.
 * Usage: usePageTracking('Product', { productName: 'xyz' })
 */
export function usePageTracking(pageName, extraData = {}) {
  const startTime = useRef(Date.now());
  const maxScroll = useRef(0);
  const reported = useRef(false);
  const milestonesHit = useRef(new Set());
  const prevUrl = useRef(window.location.pathname);

  useEffect(() => {
    startTime.current = Date.now();
    maxScroll.current = 0;
    reported.current = false;
    milestonesHit.current = new Set();
    prevUrl.current = window.location.pathname;

    // Track page view
    trackPageView(pageName, extraData);

    // ─── Scroll tracking with milestones ───
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) return;
      const depth = Math.round((scrollTop / docHeight) * 100);
      if (depth > maxScroll.current) {
        maxScroll.current = depth;
      }
      // Fire milestone events at 25%, 50%, 75%, 100%
      [25, 50, 75, 100].forEach(m => {
        if (depth >= m && !milestonesHit.current.has(m)) {
          milestonesHit.current.add(m);
          trackScrollMilestone(pageName, m, extraData);
        }
      });
    };

    // ─── Back navigation detection ───
    const handlePopState = () => {
      const newUrl = window.location.pathname;
      trackBackNavigation(pageName, newUrl, extraData);
    };

    // ─── Before unload - record time spent ───
    const handleBeforeUnload = () => {
      if (reported.current) return;
      reported.current = true;
      const elapsed = Math.round((Date.now() - startTime.current) / 1000);
      trackTimeOnPage(pageName, elapsed, maxScroll.current, extraData);
      if (maxScroll.current > 0) {
        trackScrollDepth(pageName, maxScroll.current, extraData);
      }
    };

    // ─── Visibility change (tab switch / minimize) ───
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !reported.current) {
        reported.current = true;
        const elapsed = Math.round((Date.now() - startTime.current) / 1000);
        trackTimeOnPage(pageName, elapsed, maxScroll.current, extraData);
        if (maxScroll.current > 0) {
          trackScrollDepth(pageName, maxScroll.current, extraData);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (!reported.current) {
        reported.current = true;
        const elapsed = Math.round((Date.now() - startTime.current) / 1000);
        trackTimeOnPage(pageName, elapsed, maxScroll.current, extraData);
        if (maxScroll.current > 0) {
          trackScrollDepth(pageName, maxScroll.current, extraData);
        }
      }
    };
  }, [pageName]);
}
