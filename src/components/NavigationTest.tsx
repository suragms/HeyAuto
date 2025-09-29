import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDriverAuth } from '@/hooks/useDriverAuth';

const NavigationTest: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, driver } = useDriverAuth();

  const testNavigation = (path: string) => {
    console.log(`Testing navigation to: ${path}`);
    try {
      navigate(path);
    } catch (error) {
      console.error(`Navigation error to ${path}:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Driver Navigation Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Driver Name:</strong> {driver?.name || 'None'}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => testNavigation('/driver/dashboard')}
                  className="w-full"
                >
                  Dashboard
                </Button>
                <Button 
                  onClick={() => testNavigation('/driver/profile')}
                  className="w-full"
                  variant="outline"
                >
                  Profile
                </Button>
                <Button 
                  onClick={() => testNavigation('/driver/route-map')}
                  className="w-full"
                  variant="outline"
                >
                  Route Map
                </Button>
                <Button 
                  onClick={() => testNavigation('/driver/auto-details')}
                  className="w-full"
                  variant="outline"
                >
                  Auto Details
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => testNavigation('/driver/auth')}
                  className="w-full"
                  variant="secondary"
                >
                  Auth Page
                </Button>
                <Button 
                  onClick={() => window.location.href = '/driver/dashboard'}
                  className="w-full"
                  variant="secondary"
                >
                  Direct Dashboard
                </Button>
                <Button 
                  onClick={() => window.location.href = '/driver/profile'}
                  className="w-full"
                  variant="secondary"
                >
                  Direct Profile
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  className="w-full"
                  variant="destructive"
                >
                  Reload Page
                </Button>
              </div>

              <div className="mt-6 p-4 bg-gray-100 rounded">
                <h4 className="font-semibold mb-2">Current URL:</h4>
                <p className="text-sm text-gray-600">{window.location.href}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NavigationTest;
