import React from 'react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DriverProfileTest: React.FC = () => {
  const { driver, isLoading, isAuthenticated, logout } = useDriverAuth();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/drivers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'rajesh@driver.com',
          password: 'driver123'
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        window.location.reload();
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const checkLocalStorage = () => {
    const authDriver = localStorage.getItem('auth_driver');
    console.log('LocalStorage auth_driver:', authDriver);
    if (authDriver) {
      const parsed = JSON.parse(authDriver);
      console.log('Parsed driver data:', parsed);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('auth_driver');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Driver Profile Diagnostic Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
                </div>
              </div>
              
              <div>
                <strong>Driver Data:</strong>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto">
                  {driver ? JSON.stringify(driver, null, 2) : 'No driver data'}
                </pre>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleLogin} disabled={isLoading}>
                  Test Login (rajesh@driver.com)
                </Button>
                <Button onClick={checkLocalStorage} variant="outline">
                  Check LocalStorage
                </Button>
                <Button onClick={clearStorage} variant="destructive">
                  Clear Storage & Reload
                </Button>
                <Button onClick={() => window.location.href = '/driver/profile'} variant="secondary">
                  Go to Profile Page
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverProfileTest;
