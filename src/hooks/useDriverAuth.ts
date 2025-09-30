import { useDriverAuth as useDriverAuthContext } from '@/contexts/DriverAuthContext';

/**
 * Custom hook to access driver authentication context
 * Provides driver authentication state and methods
 * 
 * @returns {DriverAuthContextType} Driver authentication context with driver data and methods
 * 
 * @throws {Error} Throws error if used outside of DriverAuthProvider
 * 
 * @example
 * ```tsx
 * const { driver, loginDriver, logoutDriver, isAuthenticated } = useDriverAuth();
 * 
 * if (isAuthenticated) {
 *   console.log('Driver:', driver?.name);
 * }
 * ```
 */
export const useDriverAuth = useDriverAuthContext;
