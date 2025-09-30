import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Code, Copy, Download, Users, Car } from 'lucide-react';
import { database } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

/**
 * Data API component for admin dashboard
 * Provides comprehensive data access and export functionality for users and drivers
 * 
 * @component
 * @returns {JSX.Element} The data API component
 * 
 * @example
 * ```tsx
 * <DataAPI />
 * ```
 */
const DataAPI: React.FC = () => {
  /** Complete data from database including users and drivers */
  const [allData, setAllData] = useState<any>(null);
  /** Loading state during data operations */
  const [isLoading, setIsLoading] = useState(false);
  /** Toast notification hook */
  const { toast } = useToast();

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [users, drivers] = await Promise.all([
        database.getUsers(),
        database.getDrivers()
      ]);

      const completeData = {
        timestamp: new Date().toISOString(),
        summary: {
          totalUsers: users.length,
          activeUsers: users.filter(u => u.isActive).length,
          totalDrivers: drivers.length,
          activeDrivers: drivers.filter(d => d.isActive).length,
          verifiedDrivers: drivers.filter(d => d.isVerified).length
        },
        users: users,
        drivers: drivers
      };

      setAllData(completeData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: `${label} copied successfully`
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    });
  };

  const downloadData = () => {
    if (!allData) return;

    const dataStr = JSON.stringify(allData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `autonow-complete-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Download Complete",
      description: "All data has been downloaded"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Data API & Export
          </CardTitle>
          <CardDescription>
            Fetch all users and drivers data including passwords for programmatic access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={fetchAllData} disabled={isLoading} className="w-full">
            {isLoading ? 'Fetching Data...' : 'Fetch All Data'}
          </Button>

          {allData && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Data fetched successfully! Found {allData.summary.totalUsers} users and {allData.summary.totalDrivers} drivers.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">{allData.summary.totalUsers}</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{allData.summary.activeUsers}</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Car className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-orange-600">{allData.summary.totalDrivers}</div>
                  <div className="text-sm text-muted-foreground">Total Drivers</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{allData.summary.verifiedDrivers}</div>
                  <div className="text-sm text-muted-foreground">Verified Drivers</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => copyToClipboard(JSON.stringify(allData, null, 2), 'Complete Data')}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All Data
                </Button>
                <Button 
                  onClick={() => copyToClipboard(JSON.stringify(allData.users, null, 2), 'Users Data')}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Users Only
                </Button>
                <Button 
                  onClick={() => copyToClipboard(JSON.stringify(allData.drivers, null, 2), 'Drivers Data')}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Drivers Only
                </Button>
                <Button 
                  onClick={downloadData}
                  variant="default"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download JSON
                </Button>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-2">Sample Data Structure:</h4>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                  <code>{JSON.stringify({
                    timestamp: "2024-01-01T00:00:00.000Z",
                    summary: {
                      totalUsers: 5,
                      activeUsers: 4,
                      totalDrivers: 3,
                      activeDrivers: 2,
                      verifiedDrivers: 1
                    },
                    users: [
                      {
                        id: "user_123",
                        name: "John Doe",
                        email: "john@example.com",
                        phone: "+1234567890",
                        password: "hashed_password",
                        role: "user",
                        isActive: true,
                        createdAt: "2024-01-01T00:00:00.000Z",
                        lastLoginAt: "2024-01-01T00:00:00.000Z"
                      }
                    ],
                    drivers: [
                      {
                        id: "driver_123",
                        name: "Jane Smith",
                        email: "jane@example.com",
                        phone: "+1234567890",
                        password: "hashed_password",
                        vehicleNumber: "ABC123",
                        isActive: true,
                        isVerified: true,
                        rating: 4.5,
                        totalRides: 100
                      }
                    ]
                  }, null, 2)}</code>
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataAPI;
