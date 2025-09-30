import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * Props for the ProtectedRoute component
 * @interface ProtectedRouteProps
 */
interface ProtectedRouteProps {
  /** Child components to render if authenticated */
  children: React.ReactNode;
}

/**
 * Protected route component that requires authentication
 * Redirects unauthenticated users to login page
 * 
 * @component
 * @param {ProtectedRouteProps} props - Component props
 * @returns {JSX.Element} The protected route component
 * 
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <UserProfile />
 * </ProtectedRoute>
 * ```
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  /** User authentication state and loading status */
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
