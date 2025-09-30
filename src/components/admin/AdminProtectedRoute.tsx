import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

/**
 * Props for the AdminProtectedRoute component
 * @interface AdminProtectedRouteProps
 */
interface AdminProtectedRouteProps {
  /** Child components to render if authenticated */
  children: React.ReactNode;
}

/**
 * Admin protected route component that requires admin authentication
 * Redirects unauthenticated users to admin login page
 * 
 * @component
 * @param {AdminProtectedRouteProps} props - Component props
 * @returns {JSX.Element} The admin protected route component
 * 
 * @example
 * ```tsx
 * <AdminProtectedRoute>
 *   <AdminDashboard />
 * </AdminProtectedRoute>
 * ```
 */
const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  /** Admin authentication state and loading status */
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
