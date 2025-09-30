import React, { useEffect, useState } from 'react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { database } from '@/lib/database';

/**
 * Profile diagnostic component for development and debugging
 * Provides comprehensive diagnostics for driver authentication and profile state
 * 
 * @component
 * @returns {JSX.Element} The profile diagnostic component
 * 
 * @example
 * ```tsx
 * <ProfileDiagnostic />
 * ```
 */
const ProfileDiagnostic: React.FC = () => {
  /** Driver authentication context */
  const { driver, isAuthenticated, isLoading } = useDriverAuth();
  /** Diagnostic results and state information */
  const [diagnostics, setDiagnostics] = useState<any>({});

  useEffect(() => {
    const runDiagnostics = async () => {
      const results: any = {
        timestamp: new Date().toISOString(),
        driverAuth: {
          isLoading,
          isAuthenticated,
          hasDriver: !!driver,
          driverId: driver?.id,
          driverName: driver?.name,
          driverEmail: driver?.email
        },
        localStorage: {
          hasAuthDriver: !!localStorage.getItem('auth_driver'),
          authDriverData: localStorage.getItem('auth_driver')
        },
        database: {}
      };

      try {
        const drivers = await database.getDrivers();
        results.database = {
          totalDrivers: drivers.length,
          drivers: drivers.map(d => ({ id: d.id, name: d.name, email: d.email, isActive: d.isActive }))
        };
      } catch (error) {
        results.database = { error: error.message };
      }

      setDiagnostics(results);
      console.log('ProfileDiagnostic: Complete diagnostics:', results);
    };

    runDiagnostics();
  }, [driver, isAuthenticated, isLoading]);

  const loginTestDriver = async () => {
    try {
      const testDriver = {
        name: 'Test Driver',
        email: 'test@driver.com',
        phone: '+91 9999999999',
        password: 'test123',
        vehicleNumber: 'KL 47 TEST',
        licenseNumber: 'DL9999999999'
      };

      const created = await database.createDriver(testDriver);
      console.log('Created test driver:', created);
      
      // Auto-login the test driver
      localStorage.setItem('auth_driver', JSON.stringify({
        id: created.id,
        name: created.name,
        email: created.email,
        phone: created.phone,
        vehicleNumber: created.vehicleNumber,
        licenseNumber: created.licenseNumber,
        isActive: created.isActive,
        isVerified: created.isVerified,
        rating: created.rating,
        totalRides: created.totalRides,
        status: created.status
      }));
      
      // Reload the page to trigger auth context update
      window.location.reload();
    } catch (error) {
      console.error('Error creating test driver:', error);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('auth_driver');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Driver Profile Diagnostic</CardTitle>
            <CardDescription>
              Comprehensive diagnostic for driver profile issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Authentication Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Has Driver:</strong> {driver ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Driver Name:</strong> {driver?.name || 'N/A'}
              </div>
            </div>

            {/* Alerts */}
            {!isAuthenticated && (
              <Alert>
                <AlertDescription>
                  <strong>Issue:</strong> Not authenticated as a driver. You need to log in to access the profile.
                </AlertDescription>
              </Alert>
            )}

            {isAuthenticated && !driver && (
              <Alert>
                <AlertDescription>
                  <strong>Issue:</strong> Authentication state shows authenticated but no driver data available.
                </AlertDescription>
              </Alert>
            )}

            {isLoading && (
              <Alert>
                <AlertDescription>
                  <strong>Status:</strong> Still loading driver authentication...
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={loginTestDriver} variant="outline">
                Create & Login Test Driver
              </Button>
              <Button onClick={clearAuth} variant="outline">
                Clear Authentication
              </Button>
              <Button onClick={() => window.location.href = '/driver/auth'} variant="outline">
                Go to Driver Login
              </Button>
            </div>

            {/* Full Diagnostics */}
            <div>
              <h3 className="font-semibold mb-2">Full Diagnostic Data:</h3>
              <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-auto">
                <pre className="text-xs">
                  {JSON.stringify(diagnostics, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileDiagnostic;
