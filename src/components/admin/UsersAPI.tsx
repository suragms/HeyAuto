import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Code, Copy, Download, Users, Database } from 'lucide-react';
import { database } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

const UsersAPI: React.FC = () => {
  const [allUsers, setAllUsers] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchAllUsersData = async () => {
    setIsLoading(true);
    try {
      const users = await database.getUsers();

      const completeData = {
        timestamp: new Date().toISOString(),
        summary: {
          totalUsers: users.length,
          activeUsers: users.filter(u => u.isActive).length,
          inactiveUsers: users.filter(u => !u.isActive).length,
          adminUsers: users.filter(u => u.role === 'admin').length,
          regularUsers: users.filter(u => u.role === 'user').length,
          driverUsers: users.filter(u => u.role === 'driver').length
        },
        users: users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLoginAt: user.lastLoginAt
        }))
      };

      setAllUsers(completeData);
    } catch (error) {
      console.error('Error fetching users data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users data",
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
    if (!allUsers) return;

    const dataStr = JSON.stringify(allUsers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `all-users-api-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Download Complete",
      description: "All users data has been downloaded"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Users Data API
          </CardTitle>
          <CardDescription>
            Fetch all users data programmatically with complete information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={fetchAllUsersData} disabled={isLoading} className="w-full">
            {isLoading ? 'Fetching Users Data...' : 'Fetch All Users Data'}
          </Button>

          {allUsers && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Users data fetched successfully! Found {allUsers.summary.totalUsers} users.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">{allUsers.summary.totalUsers}</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{allUsers.summary.activeUsers}</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{allUsers.summary.inactiveUsers}</div>
                  <div className="text-sm text-muted-foreground">Inactive Users</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{allUsers.summary.adminUsers}</div>
                  <div className="text-sm text-muted-foreground">Admin Users</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{allUsers.summary.regularUsers}</div>
                  <div className="text-sm text-muted-foreground">Regular Users</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{allUsers.summary.driverUsers}</div>
                  <div className="text-sm text-muted-foreground">Driver Users</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => copyToClipboard(JSON.stringify(allUsers, null, 2), 'Complete Users Data')}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All Data
                </Button>
                <Button 
                  onClick={() => copyToClipboard(JSON.stringify(allUsers.users, null, 2), 'Users Array')}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Users Only
                </Button>
                <Button 
                  onClick={() => copyToClipboard(JSON.stringify(allUsers.summary, null, 2), 'Summary Stats')}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Summary
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
                <h4 className="font-medium mb-2">API Response Structure:</h4>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                  <code>{JSON.stringify({
                    timestamp: "2024-01-01T00:00:00.000Z",
                    summary: {
                      totalUsers: 5,
                      activeUsers: 4,
                      inactiveUsers: 1,
                      adminUsers: 1,
                      regularUsers: 3,
                      driverUsers: 1
                    },
                    users: [
                      {
                        id: "user_123",
                        name: "John Doe",
                        email: "john@example.com",
                        phone: "+1234567890",
                        role: "user",
                        isActive: true,
                        avatar: "https://example.com/avatar.jpg",
                        createdAt: "2024-01-01T00:00:00.000Z",
                        updatedAt: "2024-01-01T00:00:00.000Z",
                        lastLoginAt: "2024-01-01T00:00:00.000Z"
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

export default UsersAPI;
