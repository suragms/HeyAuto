import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Test driver page component for development and testing
 * Provides navigation links to test driver functionality
 * 
 * @component
 * @returns {JSX.Element} The test driver page component
 * 
 * @example
 * ```tsx
 * <TestDriver />
 * ```
 */
const TestDriver: React.FC = () => {
  /** Navigation hook */
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Driver Login Test</CardTitle>
          <CardDescription>
            Test the driver login functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => navigate('/driver/auth')}
            className="w-full"
          >
            Go to Driver Auth
          </Button>
          <Button 
            onClick={() => navigate('/driver/dashboard')}
            className="w-full"
            variant="outline"
          >
            Go to Driver Dashboard
          </Button>
          <Button 
            onClick={() => navigate('/driver/profile')}
            className="w-full"
            variant="outline"
          >
            Go to Driver Profile
          </Button>
          <Button 
            onClick={() => navigate('/driver/route-map')}
            className="w-full"
            variant="outline"
          >
            Go to Route Map
          </Button>
          <Button 
            onClick={() => navigate('/driver/auto-details')}
            className="w-full"
            variant="outline"
          >
            Go to Auto Details
          </Button>
          <Button 
            onClick={() => navigate('/')}
            className="w-full"
            variant="outline"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestDriver;
