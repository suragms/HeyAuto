import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that automatically scrolls to top on route changes
 * Ensures users start at the top of the page when navigating
 * 
 * @component
 * @returns {null} This component doesn't render anything
 * 
 * @example
 * ```tsx
 * <ScrollToTop />
 * ```
 */
const ScrollToTop = () => {
  /** Current location pathname */
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
