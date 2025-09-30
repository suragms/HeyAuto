import * as React from "react";

/** Mobile breakpoint in pixels */
const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to detect if the current viewport is mobile-sized
 * Uses window.matchMedia to listen for viewport changes
 * 
 * @returns {boolean} True if viewport width is below mobile breakpoint
 * 
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 * 
 * return (
 *   <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
 *     Content
 *   </div>
 * );
 * ```
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
