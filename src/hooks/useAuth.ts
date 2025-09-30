import { useAuth as useAuthContext } from '@/contexts/AuthContext';

/**
 * Custom hook to access authentication context
 * Provides user authentication state and methods
 * 
 * @returns {AuthContextType} Authentication context with user data and methods
 * 
 * @throws {Error} Throws error if used outside of AuthProvider
 * 
 * @example
 * ```tsx
 * const { user, login, logout, isAuthenticated } = useAuth();
 * 
 * if (isAuthenticated) {
 *   console.log('User:', user?.name);
 * }
 * ```
 */
export const useAuth = useAuthContext;
