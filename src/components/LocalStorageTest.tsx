import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { database } from '@/lib/database';

/**
 * Local storage test component for development and debugging
 * Provides tools to test and inspect localStorage data and database operations
 * 
 * @component
 * @returns {JSX.Element} The local storage test component
 * 
 * @example
 * ```tsx
 * <LocalStorageTest />
 * ```
 */
const LocalStorageTest: React.FC = () => {
  /** List of drivers from database */
  const [drivers, setDrivers] = useState<any[]>([]);
  /** Data stored in localStorage */
  const [localStorageData, setLocalStorageData] = useState<any>(null);

  useEffect(() => {
    checkData();
  }, []);

  const checkData = async () => {
    try {
      // Check drivers in database
      const dbDrivers = await database.getDrivers();
      setDrivers(dbDrivers);
      
      // Check localStorage
      const authDriver = localStorage.getItem('auth_driver');
      setLocalStorageData(authDriver ? JSON.parse(authDriver) : null);
      
      // Check all localStorage keys
      console.log('All localStorage keys:', Object.keys(localStorage));
      console.log('Driver keys:', Object.keys(localStorage).filter(key => key.includes('driver')));
    } catch (error) {
      console.error('Error checking data:', error);
    }
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    checkData();
  };

  const createTestDriver = async () => {
    try {
      const testDriver = await database.createDriver({
        name: 'LocalStorage Test Driver',
        email: 'localstorage@test.com',
        phone: '+91 8888888888',
        password: 'test123',
        vehicleNumber: 'KL 47 TEST',
        licenseNumber: 'DL8888888888'
      });
      console.log('Created test driver:', testDriver);
      checkData();
    } catch (error) {
      console.error('Error creating test driver:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>LocalStorage & Database Test</CardTitle>
            <CardDescription>
              Test localStorage and database functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Drivers in Database:</strong> {drivers.length}
              </div>
              <div>
                <strong>LocalStorage Driver:</strong> {localStorageData ? 'Present' : 'Missing'}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Drivers in Database:</h3>
                <div className="bg-blue-50 p-4 rounded-lg max-h-40 overflow-auto">
                  <pre className="text-sm">
                    {JSON.stringify(drivers, null, 2)}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">LocalStorage Driver Data:</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <pre className="text-sm">
                    {JSON.stringify(localStorageData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={checkData} variant="outline">
                Refresh Data
              </Button>
              <Button onClick={createTestDriver} variant="outline">
                Create Test Driver
              </Button>
              <Button onClick={clearLocalStorage} variant="destructive">
                Clear LocalStorage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocalStorageTest;
