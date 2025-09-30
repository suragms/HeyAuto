import React, { useEffect } from 'react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { database } from '@/lib/database';

/**
 * Debug driver component for development and testing
 * Provides debugging tools for driver authentication and database operations
 * 
 * @component
 * @returns {JSX.Element} The debug driver component
 * 
 * @example
 * ```tsx
 * <DebugDriver />
 * ```
 */
const DebugDriver: React.FC = () => {
  /** Driver authentication context */
  const { driver, isAuthenticated, isLoading } = useDriverAuth();

  useEffect(() => {
    console.log('DebugDriver: Component mounted');
    console.log('DebugDriver: isLoading:', isLoading);
    console.log('DebugDriver: isAuthenticated:', isAuthenticated);
    console.log('DebugDriver: driver:', driver);
  }, [driver, isAuthenticated, isLoading]);

  const checkDrivers = async () => {
    try {
      const drivers = await database.getDrivers();
      console.log('DebugDriver: All drivers in database:', drivers);
      
      const sessions = await database.getDriverSessions();
      console.log('DebugDriver: Driver sessions:', sessions);
      
      const localDriver = localStorage.getItem('auth_driver');
      console.log('DebugDriver: Local storage driver:', localDriver);
    } catch (error) {
      console.error('DebugDriver: Error checking drivers:', error);
    }
  };

  const createTestDriver = async () => {
    try {
      const testDriver = await database.createDriver({
        name: 'Test Driver',
        email: 'test@driver.com',
        phone: '+91 9999999999',
        password: 'test123',
        vehicleNumber: 'KL 47 TEST',
        licenseNumber: 'DL9999999999'
      });
      console.log('DebugDriver: Created test driver:', testDriver);
    } catch (error) {
      console.error('DebugDriver: Error creating test driver:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Driver Authentication Debug</CardTitle>
            <CardDescription>
              Debug information for driver authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Driver Data:</strong> {driver ? 'Present' : 'Missing'}
              </div>
              <div>
                <strong>Driver Name:</strong> {driver?.name || 'N/A'}
              </div>
            </div>
            
            {driver && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Driver Details:</h3>
                <pre className="text-sm text-green-700 overflow-auto">
                  {JSON.stringify(driver, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={checkDrivers} variant="outline">
                Check Database
              </Button>
              <Button onClick={createTestDriver} variant="outline">
                Create Test Driver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebugDriver;
