import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, Shield, AlertTriangle } from 'lucide-react';

interface DriverProtectedRouteProps {
  children: React.ReactNode;
}

const DriverProtectedRoute: React.FC<DriverProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, driver } = useDriverAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Verifying driver access...</p>
          <p className="text-slate-500 text-sm mt-1">Please wait while we check your authentication</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/driver/auth" replace />;
  }

  // Additional verification check
  if (!driver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-xl">Driver Access Required</CardTitle>
            <CardDescription>
              You need to be logged in as a verified driver to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                This area is restricted to verified drivers only. Please log in with your driver credentials.
              </AlertDescription>
            </Alert>
            <Button 
              className="w-full" 
              onClick={() => window.location.href = '/driver/auth'}
            >
              <Car className="mr-2 h-4 w-4" />
              Go to Driver Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default DriverProtectedRoute;
