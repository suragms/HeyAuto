import React from 'react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SimpleDriverProfile: React.FC = () => {
  const { driver, isLoading, isAuthenticated } = useDriverAuth();

  console.log('SimpleDriverProfile: Rendering with:', {
    driver: driver ? 'Driver exists' : 'No driver',
    isLoading,
    isAuthenticated,
    driverId: driver?.id,
    driverName: driver?.name
  });

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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You need to log in as a driver to view your profile.
            </p>
            <Button 
              onClick={() => window.location.href = '/driver/auth'}
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Driver Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Driver data is not available. This might be a session issue.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.href = '/driver/auth'}
                className="w-full"
              >
                Login Again
              </Button>
              <Button 
                onClick={() => {
                  localStorage.removeItem('auth_driver');
                  window.location.reload();
                }}
                variant="outline"
                className="w-full"
              >
                Clear Session & Reload
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Driver Profile - Working!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Name:</strong> {driver.name}
              </div>
              <div>
                <strong>Email:</strong> {driver.email}
              </div>
              <div>
                <strong>Phone:</strong> {driver.phone}
              </div>
              <div>
                <strong>Vehicle Number:</strong> {driver.vehicleNumber}
              </div>
              <div>
                <strong>Status:</strong> {driver.status}
              </div>
              <div>
                <strong>Rating:</strong> {driver.rating}
              </div>
              <div>
                <strong>Total Rides:</strong> {driver.totalRides}
              </div>
              <div>
                <strong>Verified:</strong> {driver.isVerified ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Active:</strong> {driver.isActive ? 'Yes' : 'No'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleDriverProfile;
